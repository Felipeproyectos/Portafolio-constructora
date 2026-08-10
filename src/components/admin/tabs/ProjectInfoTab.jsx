import ImageUploader from "@/components/admin/ImageUploader";
import { Image } from "@/components/ui/image";
import { Star, Eye } from "lucide-react";
import { PROJECT_TYPE_LABELS, PROJECT_STATUS_LABELS } from "@/lib/projectUtils";

export default function ProjectInfoTab({ project, setProject }) {
  const update = (field, value) => setProject({ ...project, [field]: value });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Field label="Nombre del proyecto" required>
          <input
            type="text"
            value={project.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full bg-transparent border border-border p-3 text-foreground focus:border-primary focus:outline-none"
            placeholder="Ej: Construcción Centro Comunitario"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="URL Slug">
            <input
              type="text"
              value={project.slug}
              onChange={(e) => update("slug", e.target.value)}
              className="w-full bg-transparent border border-border p-3 text-foreground focus:border-primary focus:outline-none font-mono text-sm"
              placeholder="auto-generado"
            />
          </Field>
          <Field label="Año">
            <input
              type="number"
              value={project.year}
              onChange={(e) => update("year", e.target.value)}
              className="w-full bg-transparent border border-border p-3 text-foreground focus:border-primary focus:outline-none"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Tipo de proyecto">
            <select
              value={project.type}
              onChange={(e) => update("type", e.target.value)}
              className="w-full bg-transparent border border-border p-3 text-foreground focus:border-primary focus:outline-none"
            >
              {Object.entries(PROJECT_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </Field>
          <Field label="Estado">
            <select
              value={project.status}
              onChange={(e) => update("status", e.target.value)}
              className="w-full bg-transparent border border-border p-3 text-foreground focus:border-primary focus:outline-none"
            >
              {Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Ubicación">
            <input
              type="text"
              value={project.location || ""}
              onChange={(e) => update("location", e.target.value)}
              className="w-full bg-transparent border border-border p-3 text-foreground focus:border-primary focus:outline-none"
              placeholder="Ciudad, Región"
            />
          </Field>
          <Field label="Mandante / Cliente">
            <input
              type="text"
              value={project.client || ""}
              onChange={(e) => update("client", e.target.value)}
              className="w-full bg-transparent border border-border p-3 text-foreground focus:border-primary focus:outline-none"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Superficie (m²)">
            <input
              type="number"
              value={project.surface_area || 0}
              onChange={(e) => update("surface_area", e.target.value)}
              className="w-full bg-transparent border border-border p-3 text-foreground focus:border-primary focus:outline-none"
            />
          </Field>
          <Field label="Duración">
            <input
              type="text"
              value={project.duration || ""}
              onChange={(e) => update("duration", e.target.value)}
              className="w-full bg-transparent border border-border p-3 text-foreground focus:border-primary focus:outline-none"
              placeholder="Ej: 18 meses"
            />
          </Field>
        </div>

        <Field label="Descripción">
          <textarea
            rows={5}
            value={project.description || ""}
            onChange={(e) => update("description", e.target.value)}
            className="w-full bg-transparent border border-border p-3 text-foreground focus:border-primary focus:outline-none resize-none"
            placeholder="Descripción del proyecto..."
          />
        </Field>

        <Field label="ID de carpeta Google Drive (opcional)">
          <input
            type="text"
            value={project.drive_folder_id || ""}
            onChange={(e) => update("drive_folder_id", e.target.value)}
            className="w-full bg-transparent border border-border p-3 text-foreground focus:border-primary focus:outline-none font-mono text-sm"
            placeholder="Para sincronización futura con Drive"
          />
        </Field>
      </div>

      <div className="space-y-6">
        <Field label="Imagen de portada">
          {project.cover_image ? (
            <div className="relative aspect-[4/3] overflow-hidden bg-muted mb-3">
              <Image src={project.cover_image} alt="" fittingType="fill" className="w-full h-full object-cover" />
              <button
                onClick={() => update("cover_image", "")}
                className="absolute top-2 right-2 w-8 h-8 bg-foreground/80 text-background flex items-center justify-center hover:bg-destructive transition-colors"
              >
                ×
              </button>
            </div>
          ) : (
            <ImageUploader
              label="Subir imagen de portada"
              onUpload={(url) => update("cover_image", url)}
            />
          )}
        </Field>

        <div className="space-y-3">
          <ToggleRow
            icon={Star}
            label="Destacar en portada"
            description="Mostrar en la página de inicio"
            checked={project.is_featured}
            onChange={(v) => update("is_featured", v)}
          />
          <ToggleRow
            icon={Eye}
            label="Publicado"
            description="Visible para los visitantes"
            checked={project.is_published}
            onChange={(v) => update("is_published", v)}
          />
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </div>
  );
}

function ToggleRow({ icon: Icon, label, description, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 p-3 border border-border cursor-pointer hover:bg-muted/30 transition-colors">
      <Icon size={18} className="text-muted-foreground" />
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-primary"
      />
    </label>
  );
}