import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Linkedin, Facebook, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 border-2 border-background flex items-center justify-center">
                <div className="w-4 h-4 bg-background" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading font-bold text-lg tracking-tight">CONSTRUCTORA</span>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-background/60">
                  Portafolio Digital
                </span>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed max-w-md">
              Construimos espacios que transforman comunidades. De cero a obra terminada,
              cada proyecto cuenta una historia de precisión, calidad y experiencia técnica.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-background/50 mb-5">
              Navegación
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Proyectos", path: "/proyectos" },
                { label: "Nuestra Historia", path: "/historia" },
                { label: "Capacidades", path: "/capacidades" },
                { label: "Clientes", path: "/clientes" },
                { label: "Contacto", path: "/contacto" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-background/80 hover:text-background text-sm inline-flex items-center gap-1 group transition-colors"
                  >
                    {link.label}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-background/50 mb-5">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-background/80">
                <MapPin size={16} className="mt-0.5 shrink-0 text-background/50" />
                <span>Av. Principal 1234, Ciudad</span>
              </li>
              <li className="flex items-center gap-3 text-background/80">
                <Phone size={16} className="shrink-0 text-background/50" />
                <a href="tel:+56912345678" className="hover:text-background transition-colors">
                  +56 9 1234 5678
                </a>
              </li>
              <li className="flex items-center gap-3 text-background/80">
                <Mail size={16} className="shrink-0 text-background/50" />
                <a href="mailto:contacto@constructora.cl" className="hover:text-background transition-colors">
                  contacto@constructora.cl
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-4 mt-6">
              {[Instagram, Linkedin, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 border border-background/20 flex items-center justify-center hover:bg-background hover:text-foreground transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-background/40 tracking-wider">
            © {new Date().getFullYear()} CONSTRUCTORA. Todos los derechos reservados.
          </p>
          <p className="font-mono text-xs text-background/40 tracking-wider">
            De cero a obra terminada.
          </p>
        </div>
      </div>
    </footer>
  );
}