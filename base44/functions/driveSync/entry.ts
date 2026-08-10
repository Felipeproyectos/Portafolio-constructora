import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
];

const DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
];

// Google Docs/Sheets/Slides need to be exported to a real file format
const GOOGLE_DOC_EXPORTS = {
  'application/vnd.google-apps.document': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.google-apps.spreadsheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.google-apps.presentation': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const action = body.action;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // ── List folders in Drive ──
    if (action === 'list_folders') {
      const q = encodeURIComponent("mimeType='application/vnd.google-apps.folder' and trashed=false");
      const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,parents,modifiedTime)&orderBy=folder,name&pageSize=200`;
      const res = await fetch(url, { headers: authHeader });
      const data = await res.json();
      if (!res.ok) return Response.json({ error: data.error?.message || 'Drive API error' }, { status: res.status });
      return Response.json({ folders: data.files || [] });
    }

    // ── List files in a specific folder ──
    if (action === 'list_files') {
      const folderId = body.folderId;
      if (!folderId) return Response.json({ error: 'folderId required' }, { status: 400 });
      const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
      const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType,thumbnailLink,modifiedTime,size,iconLink)&orderBy=name&pageSize=200`;
      const res = await fetch(url, { headers: authHeader });
      const data = await res.json();
      if (!res.ok) return Response.json({ error: data.error?.message || 'Drive API error' }, { status: res.status });
      return Response.json({ files: data.files || [] });
    }

    // ── Import files from a folder as photos/documents ──
    if (action === 'import') {
      const { projectId, folderId, stageId } = body;
      if (!projectId || !folderId) {
        return Response.json({ error: 'projectId and folderId required' }, { status: 400 });
      }

      // List files in the folder
      const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
      const listUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType)&orderBy=name&pageSize=100`;
      const listRes = await fetch(listUrl, { headers: authHeader });
      const listData = await listRes.json();
      if (!listRes.ok) return Response.json({ error: listData.error?.message || 'Drive API error' }, { status: listRes.status });
      const files = listData.files || [];

      let photosCreated = 0;
      let docsCreated = 0;
      let order = 0;

      for (const file of files) {
        const isImage = IMAGE_MIME_TYPES.includes(file.mimeType);
        const isGoogleDoc = !!GOOGLE_DOC_EXPORTS[file.mimeType];
        const isDocument = DOCUMENT_MIME_TYPES.includes(file.mimeType) || isGoogleDoc;

        if (!isImage && !isDocument) continue;

        try {
          // Download file content from Drive
          let downloadUrl;
          if (isGoogleDoc) {
            const exportMime = GOOGLE_DOC_EXPORTS[file.mimeType];
            downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=${encodeURIComponent(exportMime)}`;
          } else {
            downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
          }

          const dlRes = await fetch(downloadUrl, { headers: authHeader });
          if (!dlRes.ok) continue;
          const blob = await dlRes.blob();
          const cleanName = file.name.replace(/\.[^/.]+$/, '') || file.name;
          const fileExt = isGoogleDoc ? '' : '';
          const fileObj = new File([blob], file.name, { type: blob.type || file.mimeType });

          // Upload to Base44 storage
          const uploadRes = await base44.asServiceRole.integrations.Core.UploadFile({ file: fileObj });
          if (!uploadRes?.file_url) continue;

          if (isImage) {
            await base44.asServiceRole.entities.ProjectPhoto.create({
              project_id: projectId,
              stage_id: stageId || null,
              url: uploadRes.file_url,
              caption: cleanName,
              type: 'general',
              order: order++,
            });
            photosCreated++;
          } else {
            await base44.asServiceRole.entities.ProjectDocument.create({
              project_id: projectId,
              title: cleanName,
              file_url: uploadRes.file_url,
              type: 'other',
              description: 'Importado desde Google Drive',
              order: order++,
            });
            docsCreated++;
          }
        } catch (fileErr) {
          // Skip individual file errors, continue with the rest
          console.error(`Error importing file ${file.name}:`, fileErr.message);
        }
      }

      // Save the Drive folder ID on the project
      await base44.asServiceRole.entities.Project.update(projectId, { drive_folder_id: folderId });

      return Response.json({
        imported: { photos: photosCreated, documents: docsCreated, total: files.length },
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}