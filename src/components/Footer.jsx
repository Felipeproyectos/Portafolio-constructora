import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowUpRight, FileText, Eye } from "lucide-react";
import { base44 } from "@/api/base44Client";

const LOGO_URL = "https://media.base44.com/images/public/6a7a0d673c6e832f34f21db3/ba9546240_ChatGPTImage10ago202616_01_24.png";

export default function Footer() {
  const [visitCount, setVisitCount] = useState(null);

  useEffect(() => {
    async function track() {
      try {
        const res = await base44.functions.invoke("trackVisit", {});
        setVisitCount(res.data.visits);
      } catch (e) {
        // silently fail — counter is non-critical
      }
    }
    track();
  }, []);

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="inline-block bg-white/95 rounded-sm px-3 py-2 mb-4">
              <img
                src={LOGO_URL}
                alt="Constructora AvenZinc"
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-background/70 text-sm leading-relaxed max-w-md">
              Constructora AvenZinc Limitada. De cero a obra terminada,
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
              Empresa
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-background/80">
                <MapPin size={16} className="mt-0.5 shrink-0 text-background/50" />
                <span>Ruta T-393 km 2, Panguipulli</span>
              </li>
              <li className="flex items-center gap-3 text-background/80">
                <FileText size={16} className="shrink-0 text-background/50" />
                <span>RUT 77887899-2</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-background/40 tracking-wider">
            © {new Date().getFullYear()} Constructora AvenZinc Limitada · RUT 77887899-2
          </p>
          <div className="flex items-center gap-6">
            {visitCount !== null && (
              <p className="font-mono text-xs text-background/40 tracking-wider inline-flex items-center gap-1.5">
                <Eye size={12} />
                {visitCount.toLocaleString("es-CL")} visitas
              </p>
            )}
            <p className="font-mono text-xs text-background/40 tracking-wider">
              Panguipulli, Chile
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}