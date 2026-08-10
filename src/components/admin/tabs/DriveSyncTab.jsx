import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Folder, Loader2, RefreshCw, Check, AlertCircle, ImageIcon, FileText, Link2, Search } from "lucide-react";

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'];

// Extract folder ID from a Drive URL or accept a raw ID
function parseFolderId(input) {
  if (!input) return null;
  const trimmed = input.trim();
  // Match /folders/ID pattern
  const match = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  // Match id=ID pattern
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];
  // Assume raw ID (Drive IDs are typically 20-33 chars, alphanumeric with - and _)
  if (/^[a-zA-Z0-9_-]{15,}$/.test(trimmed)) return trimmed;
  return null;
}

export default function DriveSyncTab({ projectId, project, setProject, stages }) {
  const [browsing, setBrowsing] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [selectedStageId, setSelectedStageId] = useState("");
  const [error, setError] = useState(null);
  const [manualInput, setManualInput] = useState("");
  const [manualError, setManualError] = useState(null);

  const browseFolders = async () => {
    setBrowsing(true);
    setError(null);
    setFolders([]);
    setSelectedFolder(null);
    setFiles([]);
    setImportResult(null);
    try {
      const res = await base44.functions.invoke("driveSync", { action: "list_folders" });
      setFolders(res.data.folders);
    } catch (e) {
      setError(e.response?.data?.error || e.message || "Error al conectar con Google Drive");
    } finally {
      setBrowsing(false);
    }
  };

  const selectFolder = async (folder) => {
    setSelectedFolder(folder);
    setLoadingFiles(true);
    setError(null);
    setImportResult(null);
    setFiles([]);
    try {
      const res = await base44.functions.invoke("driveSync", { action: "list_files", folderId: folder.id });
      setFiles(res.data.files);
    } catch (e) {
      setError(e.response?.data?.error || e.message || "Error al listar archivos");
    } finally {
      setLoadingFiles(false);
    }
  };

  const loadManualFolder = async () => {
    const folderId = parseFolderId(manualInput);
    if (!folderId) {
      setManualError("Enlace o ID de carpeta no válido. Pegue la URL de la carpeta de Drive o su ID.");
      return;
    }
    setManualError(null);
    setError(null);
    setImportResult(null);
    setFolders([]);
    setSelectedFolder({ id: folderId, name: `Carpeta ${folderId.substring(0, 8)}...` });
    setLoadingFiles(true);
    try {
      const res = await base44.functions.invoke("driveSync", { action: "list_files", folderId });
      setFiles(res.data.files);
    } catch (e) {
      setError(e.response?.data?.error || e.message || "No se pudo acceder a la carpeta. Verifique que tenga permisos.");
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleImport = async () => {
    if (!selectedFolder) return;
    setImporting(true);
    setError(null);
    setImportResult(null);
    try {
      const res = await base44.functions.invoke("driveSync", {
        action: "import",
        projectId,
        folderId: selectedFolder.id,
        stageId: selectedStageId || null,
      });
      setImportResult(res.data.imported);
      if (setProject) {
        setProject({ ...project, drive_folder_id: selectedFolder.id });
      }
    } catch (e) {
      setError(e.response?.data?.error || e.message || "Error al importar");
    } finally {
      setImporting(false);
    }
  };

  const imageFiles = files.filter((f) => IMAGE_MIME_TYPES.includes(f.mimeType));
  const docFiles = files.filter((f) => !IMAGE_MIME_TYPES.includes(f.mimeType) && !f.mimeType.includes('folder'));

  return (
    <div className="space-y-6">
      {/* Info card */}
      <div className="border border-border p-6 bg-muted/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 border border-border flex items-center justify-center bg-background shrink-0">
            <Folder size={22} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-lg">Sincronización con Google Drive</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Seleccione una carpeta de Google Drive para importar automáticamente todas las imágenes y
              documentos del proyecto. Los archivos se copian a su almacenamiento de Base44, por lo que
              permanecen disponibles aunque la conexión con Drive se desactive.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex-1 px-4 py-3 border border-border bg-background">
            <p className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground mb-1">
              Carpeta vinculada
            </p>
            <div className="flex items-center gap-2">
              {project?.drive_folder_id ? (
                <>
                  <Link2 size={14} className="text-green-600" />
                  <span className="text-sm font-mono truncate">{project.drive_folder_id}</span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">Sin carpeta vinculada</span>
              )}
            </div>
          </div>
          <button
            onClick={browseFolders}
            disabled={browsing}
            className="inline-flex items-center gap-2 px-5 py-3 bg-foreground text-background text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 shrink-0"
          >
            {browsing ? <Loader2 size={16} className="animate-spin" /> : <Folder size={16} />}
            {browsing ? "Cargando..." : "Explorar Drive"}
          </button>
        </div>
      </div>

      {/* Manual folder input */}
      <div className="border border-border p-6">
        <h4 className="font-mono text-xs tracking-wider uppercase text-muted-foreground mb-3">
          Indicar carpeta manualmente
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Pegue el enlace de la carpeta de Google Drive o su ID directamente.
        </p>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadManualFolder()}
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full pl-10 pr-4 py-3 border border-border bg-background text-sm font-mono"
            />
          </div>
          <button
            onClick={loadManualFolder}
            disabled={loadingFiles || !manualInput.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-foreground text-background text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 shrink-0"
          >
            {loadingFiles ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            {loadingFiles ? "Cargando..." : "Cargar carpeta"}
          </button>
        </div>
        {manualError && (
          <p className="text-sm text-red-600 mt-3">{manualError}</p>
        )}
      </div>

      {/* Divider with "o" */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="font-mono text-xs text-muted-foreground">o explore sus carpetas</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Folder browser */}
      {folders.length > 0 && (
        <div className="border border-border p-6">
          <h4 className="font-mono text-xs tracking-wider uppercase text-muted-foreground mb-4">
            Carpetas disponibles ({folders.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-2">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => selectFolder(folder)}
                className={`flex items-center gap-3 p-3 border text-left transition-all ${
                  selectedFolder?.id === folder.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-foreground/30 hover:bg-muted/50"
                }`}
              >
                <Folder size={18} className="text-muted-foreground shrink-0" />
                <span className="text-sm truncate">{folder.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected folder preview */}
      {selectedFolder && (
        <div className="border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h4 className="font-medium text-sm">Carpeta seleccionada</h4>
              <p className="text-sm text-muted-foreground mt-1">{selectedFolder.name}</p>
            </div>
            {loadingFiles && <Loader2 size={18} className="animate-spin text-muted-foreground" />}
          </div>

          {!loadingFiles && (
            <>
              {/* Summary */}
              <div className="flex items-center gap-6 mb-5 pb-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <ImageIcon size={16} className="text-primary" />
                  <span className="text-sm font-medium">{imageFiles.length}</span>
                  <span className="text-sm text-muted-foreground">imágenes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">{docFiles.length}</span>
                  <span className="text-sm text-muted-foreground">documentos</span>
                </div>
              </div>

              {/* Image preview grid */}
              {imageFiles.length > 0 && (
                <div className="mb-6">
                  <p className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground mb-3">
                    Vista previa de imágenes
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2">
                    {imageFiles.slice(0, 16).map((file) => (
                      <div
                        key={file.id}
                        className="aspect-square border border-border overflow-hidden bg-muted"
                      >
                        {file.thumbnailLink ? (
                          <img
                            src={file.thumbnailLink}
                            alt={file.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon size={18} className="text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {imageFiles.length > 16 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      +{imageFiles.length - 16} imagen(es) más...
                    </p>
                  )}
                </div>
              )}

              {imageFiles.length === 0 && docFiles.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Esta carpeta no contiene imágenes ni documentos importables.
                </p>
              )}

              {/* Stage selector + Import */}
              {imageFiles.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-end gap-4 pt-2">
                  <div className="flex-1">
                    <label className="block font-mono text-[10px] tracking-wider uppercase text-muted-foreground mb-2">
                      Asignar fotos a etapa (opcional)
                    </label>
                    <select
                      value={selectedStageId}
                      onChange={(e) => setSelectedStageId(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border bg-background text-sm"
                    >
                      <option value="">Sin etapa asignada</option>
                      {stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                          {stage.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleImport}
                    disabled={importing}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
                  >
                    {importing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    {importing ? "Importando..." : `Importar ${imageFiles.length} imagen(es)`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Import result */}
      {importResult && (
        <div className="border border-green-500/30 bg-green-500/5 p-5 flex items-start gap-3">
          <Check size={20} className="text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-700">Importación completada</p>
            <p className="text-sm text-green-600 mt-1">
              {importResult.photos} fotografía(s) e {importResult.documents} documento(s) importado(s)
              correctamente.
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="border border-red-500/30 bg-red-500/5 p-5 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-700">Error</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}