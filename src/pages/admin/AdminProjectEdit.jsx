import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Save, Loader2, Check } from "lucide-react";
import { PROJECT_TYPE_LABELS, PROJECT_STATUS_LABELS, DEFAULT_STAGES } from "@/lib/projectUtils";
import ProjectInfoTab from "@/components/admin/tabs/ProjectInfoTab";
import StagesTab from "@/components/admin/tabs/StagesTab";
import PhotosTab from "@/components/admin/tabs/PhotosTab";
import DocumentsTab from "@/components/admin/tabs/DocumentsTab";
import VideosTab from "@/components/admin/tabs/VideosTab";
import DriveSyncTab from "@/components/admin/tabs/DriveSyncTab";

const TABS = [
  { key: "info", label: "Información" },
  { key: "etapas", label: "Etapas" },
  { key: "fotos", label: "Fotografías" },
  { key: "docs", label: "Documentos" },
  { key: "videos", label: "Videos" },
  { key: "drive", label: "Google Drive" },
];

export default function AdminProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "nuevo";

  const [project, setProject] = useState(null);
  const [stages, setStages] = useState([]);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(isNew ? false : true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isNew) loadProject();
    else setProject({
      name: "", slug: "", location: "", year: new Date().getFullYear(),
      type: "residential", status: "completed", client: "", surface_area: 0,
      duration: "", description: "", cover_image: "", gallery_images: [],
      is_featured: false, is_published: true, drive_folder_id: "", order: 0,
    });
  }, [id]);

  async function loadProject() {
    try {
      const data = await base44.entities.Project.get(id);
      setProject(data);
      const stageData = await base44.entities.ProjectStage.filter({ project_id: id }, "order", 50);
      setStages(stageData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    if (!project.name) { alert("El nombre del proyecto es obligatorio"); return; }
    setSaving(true);
    setSaved(false);
    try {
      let savedProject;
      const slug = project.slug || generateSlug(project.name);
      const payload = { ...project, slug, surface_area: Number(project.surface_area) || 0, year: Number(project.year) || new Date().getFullYear() };

      if (isNew) {
        savedProject = await base44.entities.Project.create(payload);
        navigate(`/admin/proyectos/${savedProject.id}`, { replace: true });
      } else {
        savedProject = await base44.entities.Project.update(id, payload);
        setProject(savedProject);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert("Error al guardar: " + (e.message || "desconocido"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground mb-4">Proyecto no encontrado.</p>
        <Link to="/admin/proyectos" className="text-primary hover:underline">Volver a proyectos</Link>
      </div>
    );
  }

  const projectId = isNew ? null : id;

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/admin/proyectos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors">
            <ArrowLeft size={16} /> Volver a proyectos
          </Link>
          <h1 className="text-3xl font-heading font-bold">
            {isNew ? "Nuevo proyecto" : "Editar proyecto"}
          </h1>
          {!isNew && (
            <p className="font-mono text-xs text-muted-foreground mt-1">ID: {id}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600">
              <Check size={16} /> Guardado
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-3 bg-foreground text-background text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Guardando..." : "Guardar proyecto"}
          </button>
        </div>
      </div>

      {!projectId && (
        <div className="mb-6 p-4 border border-primary/30 bg-primary/5">
          <p className="text-sm text-foreground">
            <span className="font-medium">Primero guarde el proyecto</span> para poder agregar etapas, fotos, documentos y videos.
          </p>
        </div>
      )}

      {/* TABS */}
      <div className="border-b border-border mb-8">
        <div className="flex items-center gap-1">
          {TABS.map((tab) => {
            const disabled = tab.key !== "info" && !projectId;
            return (
              <button
                key={tab.key}
                onClick={() => !disabled && setActiveTab(tab.key)}
                disabled={disabled}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.key
                    ? "border-primary text-foreground"
                    : disabled
                    ? "border-transparent text-muted-foreground/40 cursor-not-allowed"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "info" && (
        <ProjectInfoTab project={project} setProject={setProject} />
      )}
      {activeTab === "etapas" && projectId && (
        <StagesTab projectId={projectId} stages={stages} setStages={setStages} />
      )}
      {activeTab === "fotos" && projectId && (
        <PhotosTab projectId={projectId} stages={stages} />
      )}
      {activeTab === "docs" && projectId && (
        <DocumentsTab projectId={projectId} />
      )}
      {activeTab === "videos" && projectId && (
        <VideosTab projectId={projectId} />
      )}
      {activeTab === "drive" && projectId && (
        <DriveSyncTab projectId={projectId} project={project} setProject={setProject} stages={stages} />
      )}
    </div>
  );
}

function generateSlug(name) {
  return name.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}