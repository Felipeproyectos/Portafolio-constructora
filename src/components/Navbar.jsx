import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Inicio", path: "/" },
  { label: "Proyectos", path: "/proyectos" },
  { label: "Historia", path: "/historia" },
  { label: "Capacidades", path: "/capacidades" },
  { label: "Clientes", path: "/clientes" },
  { label: "Contacto", path: "/contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isTransparent
            ? "bg-transparent"
            : "bg-background/90 backdrop-blur-xl border-b border-border/60"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="group flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 border-2 border-foreground flex items-center justify-center">
                  <div className="w-4 h-4 bg-foreground group-hover:bg-primary transition-colors duration-300" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className={`font-heading font-bold text-lg tracking-tight ${isTransparent ? "text-white" : "text-foreground"}`}>
                  CONSTRUCTORA
                </span>
                <span className={`font-mono text-[10px] tracking-[0.2em] uppercase ${isTransparent ? "text-white/70" : "text-muted-foreground"}`}>
                  Portafolio Digital
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      isTransparent
                        ? isActive
                          ? "text-white"
                          : "text-white/80 hover:text-white"
                        : isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute bottom-0 left-4 right-4 h-px bg-primary"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:block">
              <Link
                to="/contacto"
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <span>Cotizar Proyecto</span>
                <span className="w-1 h-1 bg-current rounded-full group-hover:w-4 transition-all duration-300" />
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 ${isTransparent ? "text-white" : "text-foreground"}`}
              aria-label="Menú"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-20 z-40 bg-background lg:hidden"
          >
            <nav className="flex flex-col p-6 gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className={`block py-4 text-2xl font-heading font-semibold border-b border-border ${
                      location.pathname === link.path ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                to="/contacto"
                className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-4 bg-foreground text-background text-base font-medium"
              >
                Cotizar Proyecto
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}