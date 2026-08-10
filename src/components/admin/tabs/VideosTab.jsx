import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Loader2, Video } from "lucide-react";

const VIDEO_TYPES = [
  { value: "progress", label: "Avance" },
  { value: "timelapse", label: "Timelapse" },
  { value: "final", label: "Video Final" },
  { value: "tour", label: "Recorrido" },
];

export default function VideosTab({ projectId }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newVideo, setNewVideo] = useState({ title: "", url: "", type: "progress", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, [projectId]);

  async function load() {
    setLoading(true);
    try {
      const data = await base44.entities.ProjectVideo.filter({ project_id: projectId }, "order", 50);
      setVideos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const addVideo = async () => {
    if (!newVideo.title || !newVideo.url) return;
    setSaving(true);
    try {
      const created = await base44.entities.ProjectVideo.create({
        ...newVideo,
        project_id: projectId,
        order: videos.length,
      });
      setVideos([...videos, created]);
      setNewVideo({ title: "", url: "", type: "progress", description: "" });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const deleteVideo = async (video) => {
    if (!confirm("¿Eliminar este video?")) return;
    try {
      await base44.entities.ProjectVideo.delete(video.id);
      setVideos(videos.filter((v) => v.id !== video.id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-heading font-semibold mb-1">Videos del proyecto</h2>
        <p className="text-sm text-muted-foreground">Avances, timelapses, recorridos y videos finales.</p>
      </div>

      <div className="border border-border p-4 mb-6 bg-muted/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="Título del video"
            value={newVideo.title}
            onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
            className="bg-background border border-border p-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <input
            type="url"
            placeholder="URL (YouTube, Vimeo, o directa)"
            value={newVideo.url}
            onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
            className="bg-background border border-border p-2.5 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <select
            value={newVideo.type}
            onChange={(e) => setNewVideo({ ...newVideo, type: e.target.value })}
            className="bg-background border border-border p-2.5 text-sm focus:border-primary focus:outline-none"
          >
            {VIDEO_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={newVideo.description}
            onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
            className="bg-background border border-border p-2.5 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <button
          onClick={addVideo}
          disabled={saving || !newVideo.title || !newVideo.url}
          className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Agregar video
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : videos.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground text-sm">No hay videos cargados.</p>
      ) : (
        <div className="space-y-3">
          {videos.map((video) => (
            <div key={video.id} className="flex items-center gap-4 p-4 border border-border hover:bg-muted/30 transition-colors">
              <div className="w-16 h-12 bg-muted flex items-center justify-center shrink-0">
                <Video size={20} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{video.title}</p>
                <p className="font-mono text-xs text-muted-foreground capitalize">{video.type} · {video.url.substring(0, 50)}...</p>
              </div>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline px-3 py-1.5"
              >
                Ver
              </a>
              <button
                onClick={() => deleteVideo(video)}
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