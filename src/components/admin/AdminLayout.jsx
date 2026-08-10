import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Mail, ArrowLeft, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";

const NAV_ITEMS = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/proyectos", icon: FolderKanban, label: "Proyectos" },
  { to: "/admin/mensajes", icon: Mail, label: "Mensajes" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await base44.auth.logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-60 bg-foreground text-background flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-background/10">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-background flex items-center justify-center">
              <div className="w-3 h-3 bg-background" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-bold text-sm">CONSTRUCTORA</span>
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-background/50">Admin Panel</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to ||
              (item.to === "/admin/proyectos" && location.pathname.startsWith("/admin/proyectos"));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  isActive ? "bg-background/10 text-background" : "text-background/60 hover:text-background hover:bg-background/5"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-background/10 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-sm text-background/60 hover:text-background hover:bg-background/5 transition-colors">
            <ArrowLeft size={18} /> Volver al sitio
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-background/60 hover:text-background hover:bg-background/5 transition-colors">
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-60 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}