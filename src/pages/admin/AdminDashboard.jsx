import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { FolderKanban, Mail, CheckCircle2, Clock, ArrowRight, Plus } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, messages: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [projects, messages] = await Promise.all([
          base44.entities.Project.list("-updated_date", 100),
          base44.entities.ContactMessage.filter({ status: "new" }, "-created_date", 5),
        ]);
        setStats({
          total: projects.length,
          completed: projects.filter((p) => p.status === "completed").length,
          inProgress: projects.filter((p) => p.status === "in_progress").length,
          messages: messages.length,
        });
        setRecentMessages(messages);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-10">
        <h1 className="text-3xl font-heading font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de la plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={FolderKanban} label="Total Proyectos" value={stats.total} />
        <StatCard icon={CheckCircle2} label="Finalizados" value={stats.completed} />
        <StatCard icon={Clock} label="En Ejecución" value={stats.inProgress} />
        <StatCard icon={Mail} label="Mensajes Nuevos" value={stats.messages} highlight />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-semibold">Mensajes recientes</h2>
            <Link to="/admin/mensajes" className="text-sm text-primary hover:underline flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          {recentMessages.length > 0 ? (
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="border-b border-border pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{msg.name}</p>
                    <span className="font-mono text-xs text-muted-foreground">
                      {new Date(msg.created_date).toLocaleDateString("es-CL")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay mensajes nuevos.</p>
          )}
        </div>

        <div className="border border-border p-6">
          <h2 className="text-lg font-heading font-semibold mb-6">Acciones rápidas</h2>
          <div className="space-y-3">
            <Link to="/admin/proyectos/nuevo" className="flex items-center gap-3 p-4 border border-border hover:border-foreground hover:bg-muted/50 transition-all group">
              <div className="w-10 h-10 bg-foreground text-background flex items-center justify-center group-hover:bg-primary transition-colors">
                <Plus size={18} />
              </div>
              <div>
                <p className="font-medium">Crear nuevo proyecto</p>
                <p className="text-sm text-muted-foreground">Agregue una obra al portafolio</p>
              </div>
            </Link>
            <Link to="/admin/proyectos" className="flex items-center gap-3 p-4 border border-border hover:border-foreground hover:bg-muted/50 transition-all group">
              <div className="w-10 h-10 bg-foreground text-background flex items-center justify-center group-hover:bg-primary transition-colors">
                <FolderKanban size={18} />
              </div>
              <div>
                <p className="font-medium">Gestionar proyectos</p>
                <p className="text-sm text-muted-foreground">Edite o elimine proyectos existentes</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, highlight }) {
  return (
    <div className={`border p-6 ${highlight && value > 0 ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
      <Icon size={20} className={highlight && value > 0 ? "text-primary" : "text-muted-foreground"} />
      <p className="text-3xl font-heading font-bold mt-4">{value}</p>
      <p className="font-mono text-xs tracking-wider uppercase text-muted-foreground mt-1">{label}</p>
    </div>
  );
}