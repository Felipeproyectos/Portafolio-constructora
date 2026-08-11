import { motion } from "framer-motion";
import { Frame, Layers, SprayCan, Home as HomeIcon } from "lucide-react";

const SERVICES = [
  {
    title: "Fabricación de ventanas termopanel",
    description: "Ventanas de doble vidriado hermético (DVH) a medida, con aislación térmica y acústica superior para cada proyecto.",
    icon: Frame,
  },
  {
    title: "Fabricación de panel SIP",
    description: "Paneles estructurales aislados (SIP) para una construcción rápida, eficiente y de alto desempeño térmico.",
    icon: Layers,
  },
  {
    title: "Aislante con celulosa proyectada",
    description: "Aplicación de celulosa proyectada en muros y techumbres para mejorar la aislación térmica, acústica y la eficiencia energética.",
    icon: SprayCan,
  },
  {
    title: "Venta e instalación de techumbre y hojalatería",
    description: "Suministro e instalación de cubiertas, canaletas y hojalatería en general, con terminaciones de calidad y estanqueidad garantizada.",
    icon: HomeIcon,
  },
];

export default function Services() {
  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="py-20 lg:py-28 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div initial={{ width: 0 }} animate={{ width: 64 }} transition={{ duration: 0.6 }} className="h-px bg-primary mb-8" />
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-4">
            Servicios
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight max-w-4xl">
            Fabricación e instalación a medida.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Además de nuestras obras, fabricamos e instalamos los componentes que hacen tu proyecto más eficiente y duradero.
          </motion.p>
        </div>
      </section>

      {/* GRID */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 2) * 0.1 }}
                  className="group bg-background p-10 lg:p-12 hover:bg-foreground hover:text-background transition-colors duration-500"
                >
                  <div className="flex items-start justify-between mb-8">
                    <Icon size={32} className="text-primary" />
                    <span className="font-mono text-xs text-muted-foreground group-hover:text-background/40 transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground group-hover:text-background/70 transition-colors leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
