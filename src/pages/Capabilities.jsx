import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import SectionHeading from "@/components/shared/SectionHeading";
import { Building2, HardHat, Ruler, Briefcase, Wrench, Trees, Hammer, Layers, Map, ShieldCheck } from "lucide-react";

const ICON_MAP = {
  building: Building2, hardhat: HardHat, ruler: Ruler, briefcase: Briefcase,
  wrench: Wrench, trees: Trees, hammer: Hammer, layers: Layers, map: Map, shield: ShieldCheck,
};

const FALLBACK_CAPS = [
  { title: "Obras Civiles", description: "Infraestructura y obras de ingeniería de gran envergadura: caminos, puentes, saneamiento y obras portuarias.", icon: "building" },
  { title: "Construcción", description: "Edificación residencial, comercial e industrial con los más altos estándares de calidad y seguridad.", icon: "hardhat" },
  { title: "Remodelación", description: "Renovación, ampliación y restauración de espacios existentes, preservando su valor original.", icon: "hammer" },
  { title: "Infraestructura", description: "Construcción de redes viales, sanitarias y energéticas para el desarrollo territorial.", icon: "map" },
  { title: "Urbanización", description: "Espacios públicos, plazas, áreas verdes y vialidad urbana que conectan comunidades.", icon: "trees" },
  { title: "Edificación", description: "Proyectos inmobiliarios y corporativos llave en mano, desde el diseño hasta la entrega.", icon: "layers" },
  { title: "Mantención", description: "Servicios de mantención preventiva y correctiva para infraestructura y edificaciones.", icon: "wrench" },
  { title: "Calidad y Seguridad", description: "Certificaciones y protocolos de seguridad que garantizan la excelencia en cada obra.", icon: "shield" },
];

export default function Capabilities() {
  const [capabilities, setCapabilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await base44.entities.Capability.list("order", 20);
        setCapabilities(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const caps = capabilities.length > 0 ? capabilities : FALLBACK_CAPS;

  return (
    <div className="pt-20">
      <section className="py-20 lg:py-28 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div initial={{ width: 0 }} animate={{ width: 64 }} transition={{ duration: 0.6 }} className="h-px bg-primary mb-8" />
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-4">
            Capacidades
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight max-w-4xl">
            Servicios que cubren todo el ciclo constructivo.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Desde la primera excavación hasta la entrega final, contamos con las capacidades técnicas y humanas para ejecutar cualquier desafío.
          </motion.p>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {[...Array(6)].map((_, i) => <div key={i} className="aspect-[4/3] bg-background animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {caps.map((cap, i) => {
                const Icon = ICON_MAP[cap.icon?.toLowerCase()] || Building2;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
                    className="group bg-background p-10 lg:p-12 hover:bg-foreground hover:text-background transition-colors duration-500"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <Icon size={32} className="text-primary" />
                      <span className="font-mono text-xs text-muted-foreground group-hover:text-background/40 transition-colors">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-3">{cap.title}</h3>
                    <p className="text-muted-foreground group-hover:text-background/70 transition-colors leading-relaxed">
                      {cap.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}