import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Trash2, Loader2, Upload, FileText } from "lucide-react";

const DOC_TYPES = [
  { value: "plan", label: "Plano" },
  { value: "technical_sheet", label: "Ficha Técnica" },
  { value: "contract", label: "Contrato" },
  { value: "report", label: "Informe" },
  { value: "other", label: "Otro" },
];

export default function DocumentsTab({ projectId }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: "", type: "other", description: "" });

  useEffect(() => {
    load();
  }, [projectId]);

  async function load() {
    setLoading(true);
    try {
      const data = await base44.entities.ProjectDocument.filter({ project_id: projectId }, "order", 100);
      setDocuments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const result = await base44.integrations.Core.UploadFile({ file });
        const doc = await base44.entities.ProjectDocument.create({
          project_id: projectId,
          title: newDoc.title || file.name,
          file_url: result.file_url,
          type: newDoc.type,
          description: newDoc.description,
          order: documents.length,
        });
        setDocuments([...documents, doc]);
      }
      setNewDoc({ title: "", type: "other", description: "" });
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const deleteDoc = async (doc) => {
    if (!confirm("¿Eliminar este documento?")) return;
    try {
      await base44.entities.ProjectDocument.delete(doc.id);
      setDocuments(documents.filter((d) => d.id !== doc.id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-heading font-semibold mb-1">Documentos del proyecto</h2>
        <p className="text-sm text-muted-foreground">Planos, fichas técnicas, contratos e informes.</p>
      </div>

      <div className="border border-border p-4 mb-6 bg-muted/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input
            type="text"
            placeholder="Título del documento"
            value={newDoc.title}
            onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
            className="bg-background border border-border p-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <select
            value={newDoc.type}
            onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
            className="bg-background border border-border p-2.5 text-sm focus:border-primary focus:outline-none"
          >
            {DOC_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={newDoc.description}
            onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
            className="bg-background border border-border p-2.5 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Subiendo..." : "Seleccionar archivo"}
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.jpg,.png"
            className="hidden"
            onChange={(e) => handleUpload([...e.target.files])}
          />
        </label>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : documents.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground text-sm">No hay documentos cargados.</p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 p-4 border border-border hover:bg-muted/30 transition-colors">
              <div className="w-10 h-10 bg-muted flex items-center justify-center shrink-0">
                <FileText size={18} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{doc.title}</p>
                <p className="font-mono text-xs text-muted-foreground capitalize">{doc.type.replace("_", " ")}</p>
              </div>
              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline px-3 py-1.5"
              >
                Ver
              </a>
              <button
                onClick={() => deleteDoc(doc)}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}