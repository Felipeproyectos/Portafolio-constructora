import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import ImageUploader from "@/components/admin/ImageUploader";
import { Image } from "@/components/ui/image";
import { Trash2, Loader2 } from "lucide-react";

const PHOTO_TYPES = [
  { value: "general", label: "General" },
  { value: "before", label: "Antes" },
  { value: "during", label: "Durante" },
  { value: "after", label: "Después" },
];

export default function PhotosTab({ projectId, stages }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [projectId]);

  async function load() {
    setLoading(true);
    try {
      const data = await base44.entities.ProjectPhoto.filter({ project_id: projectId }, "order", 200);
      setPhotos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleUpload = async (urls) => {
    const urlArray = Array.isArray(urls) ? urls : [urls];
    try {
      const created = await base44.entities.ProjectPhoto.bulkCreate(
        urlArray.map((url, i) => ({
          project_id: projectId,
          url,
          caption: "",
          type: "general",
          stage_id: stages[0]?.id || "",
          order: photos.length + i,
        }))
      );
      setPhotos([...photos, ...created]);
    } catch (e) {
      console.error(e);
    }
  };

  const updatePhoto = async (photo, field, value) => {
    try {
      await base44.entities.ProjectPhoto.update(photo.id, { [field]: value });
      setPhotos(photos.map((p) => p.id === photo.id ? { ...p, [field]: value } : p));
    } catch (e) {
      console.error(e);
    }
  };

  const deletePhoto = async (photo) => {
    if (!confirm("¿Eliminar esta fotografía?")) return;
    try {
      await base44.entities.ProjectPhoto.delete(photo.id);
      setPhotos(photos.filter((p) => p.id !== photo.id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-heading font-semibold mb-1">Fotografías del proyecto</h2>
        <p className="text-sm text-muted-foreground">Suba y organice las fotos por etapa y tipo (antes/durante/después).</p>
      </div>

      <div className="mb-8">
        <ImageUploader label="Subir fotografías" multiple onUpload={handleUpload} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : photos.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground text-sm">No hay fotografías cargadas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="border border-border">
              <div className="relative aspect-[4/3] bg-muted overflow-hidden group">
                <Image src={photo.url} alt="" fittingType="fill" className="w-full h-full object-cover" />
                <button
                  onClick={() => deletePhoto(photo)}
                  className="absolute top-2 right-2 w-8 h-8 bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-3 space-y-2">
                <input
                  type="text"
                  placeholder="Descripción..."
                  value={photo.caption || ""}
                  onChange={(e) => updatePhoto(photo, "caption", e.target.value)}
                  className="w-full bg-transparent border border-border p-2 text-xs focus:border-primary focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={photo.stage_id || ""}
                    onChange={(e) => updatePhoto(photo, "stage_id", e.target.value)}
                    className="bg-transparent border border-border p-2 text-xs focus:border-primary focus:outline-none"
                  >
                    <option value="">Sin etapa</option>
                    {stages.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                  <select
                    value={photo.type || "general"}
                    onChange={(e) => updatePhoto(photo, "type", e.target.value)}
                    className="bg-transparent border border-border p-2 text-xs focus:border-primary focus:outline-none"
                  >
                    {PHOTO_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}