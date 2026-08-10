import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, GripVertical, Loader2 } from "lucide-react";
import { DEFAULT_STAGES } from "@/lib/projectUtils";

export default function StagesTab({ projectId, stages, setStages }) {
  const [newStage, setNewStage] = useState({ title: "", description: "", start_date: "", end_date: "" });
  const [saving, setSaving] = useState(false);

  const addStage = async () => {
    if (!newStage.title) return;
    setSaving(true);
    try {
      const order = stages.length > 0 ? Math.max(...stages.map((s) => s.order || 0)) + 1 : 1;
      const created = await base44.entities.ProjectStage.create({
        ...newStage,
        project_id: projectId,
        order,
        progress: 0,
      });
      setStages([...stages, created]);
      setNewStage({ title: "", description: "", start_date: "", end_date: "" });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const deleteStage = async (stage) => {
    if (!confirm(`¿Eliminar la etapa "${stage.title}"?`)) return;
    try {
      await base44.entities.ProjectStage.delete(stage.id);
      setStages(stages.filter((s) => s.id !== stage.id));
    } catch (e) {
      console.error(e);
    }
  };

  const updateStage = async (stage, field, value) => {
    try {
      await base44.entities.ProjectStage.update(stage.id, { [field]: value });
      setStages(stages.map((s) => s.id === stage.id ? { ...s, [field]: value } : s));
    } catch (e) {
      console.error(e);
    }
  };

  const addDefaultStages = async () => {
    setSaving(true);
    try {
      const existingOrders = stages.map((s) => s.order || 0);
      const startOrder = existingOrders.length > 0 ? Math.max(...existingOrders) + 1 : 1;
      const created = await base44.entities.ProjectStage.bulkCreate(
        DEFAULT_STAGES.map((s, i) => ({
          ...s,
          order: startOrder + i,
          project_id: projectId,
          progress: 0,
        }))
      );
      setStages([...stages, ...created]);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading font-semibold mb-1">Etapas de construcción</h2>
          <p className="text-sm text-muted-foreground">Organice la línea de tiempo del proyecto (Terreno → Obra Terminada).</p>
        </div>
        {stages.length === 0 && (
          <button
            onClick={addDefaultStages}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm hover:border-foreground transition-colors"
          >
            <Plus size={16} /> Agregar etapas estándar
          </button>
        )}
      </div>

      {/* ADD NEW */}
      <div className="border border-border p-4 mb-6 bg-muted/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input
            type="text"
            placeholder="Título de la etapa"
            value={newStage.title}
            onChange={(e) => setNewStage({ ...newStage, title: e.target.value })}
            className="bg-background border border-border p-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <input
            type="date"
            value={newStage.start_date}
            onChange={(e) => setNewStage({ ...newStage, start_date: e.target.value })}
            className="bg-background border border-border p-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <input
            type="date"
            value={newStage.end_date}
            onChange={(e) => setNewStage({ ...newStage, end_date: e.target.value })}
            className="bg-background border border-border p-2.5 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <textarea
          placeholder="Descripción de la etapa"
          value={newStage.description}
          onChange={(e) => setNewStage({ ...newStage, description: e.target.value })}
          rows={2}
          className="w-full bg-background border border-border p-2.5 text-sm focus:border-primary focus:outline-none resize-none mb-3"
        />
        <button
          onClick={addStage}
          disabled={saving || !newStage.title}
          className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Agregar etapa
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {stages.map((stage, i) => (
          <div key={stage.id} className="border border-border p-4 flex items-start gap-4">
            <div className="flex flex-col items-center gap-1 pt-1">
              <GripVertical size={16} className="text-muted-foreground/40" />
              <span className="font-mono text-xs text-muted-foreground">{String(stage.order || i + 1).padStart(2, "0")}</span>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={stage.title}
                onChange={(e) => updateStage(stage, "title", e.target.value)}
                className="bg-transparent border border-transparent hover:border-border focus:border-primary focus:outline-none p-1.5 text-sm font-medium"
              />
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={stage.start_date || ""}
                  onChange={(e) => updateStage(stage, "start_date", e.target.value)}
                  className="bg-transparent border border-border p-1.5 text-xs focus:border-primary focus:outline-none"
                />
                <input
                  type="date"
                  value={stage.end_date || ""}
                  onChange={(e) => updateStage(stage, "end_date", e.target.value)}
                  className="bg-transparent border border-border p-1.5 text-xs focus:border-primary focus:outline-none"
                />
              </div>
              <textarea
                value={stage.description || ""}
                onChange={(e) => updateStage(stage, "description", e.target.value)}
                placeholder="Descripción..."
                rows={1}
                className="md:col-span-2 bg-transparent border border-transparent hover:border-border focus:border-primary focus:outline-none p-1.5 text-sm resize-none"
              />
            </div>
            <button
              onClick={() => deleteStage(stage)}
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {stages.length === 0 && (
          <p className="text-center py-12 text-muted-foreground text-sm">
            No hay etapas. Agregue etapas manualmente o use el botón "Agregar etapas estándar".
          </p>
        )}
      </div>
    </div>
  );
}