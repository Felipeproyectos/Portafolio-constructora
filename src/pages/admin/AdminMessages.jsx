import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Mail, Trash2, MailOpen, CheckCircle2, ArrowLeft } from "lucide-react";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await base44.entities.ContactMessage.list("-created_date", 200);
      setMessages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (msg, status) => {
    try {
      await base44.entities.ContactMessage.update(msg.id, { status });
      setMessages(messages.map((m) => m.id === msg.id ? { ...m, status } : m));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (msg) => {
    if (!confirm("¿Eliminar este mensaje?")) return;
    try {
      await base44.entities.ContactMessage.delete(msg.id);
      setMessages(messages.filter((m) => m.id !== msg.id));
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = filter === "all" ? messages : messages.filter((m) => m.status === filter);

  const statusBadge = (status) => {
    const styles = {
      new: "bg-primary/10 text-primary",
      read: "bg-muted text-muted-foreground",
      responded: "bg-green-100 text-green-700",
    };
    const labels = { new: "Nuevo", read: "Leído", responded: "Respondido" };
    return <span className={`px-2 py-0.5 text-[10px] font-mono uppercase ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Mensajes</h1>
          <p className="text-muted-foreground">{messages.length} mensajes recibidos.</p>
        </div>
        <div className="flex items-center gap-2">
          {["all", "new", "read", "responded"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium border transition-colors ${
                filter === f ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"
              }`}
            >
              {f === "all" ? "Todos" : f === "new" ? "Nuevos" : f === "read" ? "Leídos" : "Respondidos"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-muted animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Mail size={32} className="mx-auto mb-4 opacity-50" />
          <p>No hay mensajes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((msg) => (
            <div key={msg.id} className="border border-border p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-heading font-semibold">{msg.name}</h3>
                    {statusBadge(msg.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <a href={`mailto:${msg.email}`} className="hover:text-foreground">{msg.email}</a>
                    {msg.phone && <span>· {msg.phone}</span>}
                    <span className="font-mono text-xs">
                      {new Date(msg.created_date).toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {msg.status === "new" && (
                    <button onClick={() => updateStatus(msg, "read")} className="w-9 h-9 flex items-center justify-center border border-border hover:border-foreground transition-colors" title="Marcar como leído">
                      <MailOpen size={16} />
                    </button>
                  )}
                  {msg.status !== "responded" && (
                    <button onClick={() => updateStatus(msg, "responded")} className="w-9 h-9 flex items-center justify-center border border-border hover:border-green-600 hover:text-green-600 transition-colors" title="Marcar como respondido">
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(msg)} className="w-9 h-9 flex items-center justify-center border border-border hover:border-destructive hover:text-destructive transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {msg.project_interest && (
                <p className="font-mono text-xs text-primary mb-2">Proyecto de interés: {msg.project_interest}</p>
              )}
              <p className="text-sm text-foreground/80 leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}