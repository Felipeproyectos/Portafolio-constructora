import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { getProjectTypeLabel, getProjectStatusLabel } from "@/lib/projectUtils";
import { Image } from "@/components/ui/image";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await base44.entities.Project.list("-updated_date", 200);
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (project) => {
    if (!confirm(`¿Eliminar el proyecto "${project.name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await base44.entities.Project.delete(project.id);
      setProjects(projects.filter((p) => p.id !== project.id));
    } catch (e) {
      alert("Error al eliminar el proyecto");
    }
  };

  const toggleFeatured = async (project) => {
    try {
      await base44.entities.Project.update(project.id, { is_featured: !project.is_featured });
      setProjects(projects.map((p) => p.id === project.id ? { ...p, is_featured: !p.is_featured } : p));
    } catch (e) {
      console.error(e);
    }
  };

  const togglePublished = async (project) => {
    try {
      await base44.entities.Project.update(project.id, { is_published: !project.is_published });
      setProjects(projects.map((p) => p.id === project.id ? { ...p, is_published: !p.is_published } : p));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Proyectos</h1>
          <p className="text-muted-foreground">{projects.length} proyectos en el portafolio.</p>
        </div>
        <Link
          to="/admin/proyectos/nuevo"
          className="inline-flex items-center gap-2 px-5 py-3 bg-foreground text-background text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Plus size={18} /> Nuevo proyecto
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-muted animate-pulse" />)}
        </div>
      ) : (
        <div className="border border-border">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={`flex items-center gap-6 p-4 hover:bg-muted/30 transition-colors ${i !== projects.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="w-20 h-20 bg-muted overflow-hidden shrink-0">
                {project.cover_image ? (
                  <Image src={project.cover_image} alt="" fittingType="fill" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">—</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium truncate">{project.name}</h3>
                  <span className={`px-2 py-0.5 text-[10px] font-mono uppercase ${
                    project.status === "completed" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                  }`}>
                    {getProjectStatusLabel(project.status)}
                  </span>
                  {!project.is_published && (
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-muted text-muted-foreground">Borrador</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {getProjectTypeLabel(project.type)} · {project.location || "Sin ubicación"} · {project.year}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleFeatured(project)}
                  className={`w-9 h-9 flex items-center justify-center border transition-colors ${
                    project.is_featured ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                  title="Destacar en portada"
                >
                  <Star size={16} fill={project.is_featured ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={() => togglePublished(project)}
                  className="w-9 h-9 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground transition-colors"
                  title={project.is_published ? "Ocultar" : "Publicar"}
                >
                  {project.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <Link
                  to={`/admin/proyectos/${project.id}`}
                  className="w-9 h-9 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(project)}
                  className="w-9 h-9 flex items-center justify-center border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}