import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { Frame, Layers, SprayCan, Home as HomeIcon } from "lucide-react";

const SERVICES = [
  {
    title: "Fabricación de ventanas termopanel",
    description: "Ventanas de doble vidriado hermético (DVH) a medida, con aislación térmica y acústica superior para cada proyecto.",
    icon: Frame,
    image: "/photos/services/ventana-termopanel-v2.jpg",
  },
  {
    title: "Fabricación de panel SIP",
    description: "Paneles estructurales aislados (SIP) para una construcción rápida, eficiente y de alto desempeño térmico.",
    icon: Layers,
    image: "/photos/services/panel-sip-v3.jpg",
  },
  {
    title: "Aislante con celulosa proyectada",
    description: "Aplicación de celulosa proyectada en muros y techumbres para mejorar la aislación térmica, acústica y la eficiencia energética.",
    icon: SprayCan,
    image: "/photos/services/celulosa-proyectada-v2.jpg",
  },
  {
    title: "Venta e instalación de techumbre y hojalatería",
    description: "Suministro e instalación de cubiertas, canaletas y hojalatería en general, con terminaciones de calidad y estanqueidad garantizada.",
    icon: HomeIcon,
    image: "/photos/services/techumbre-hojalateria-v2.jpg",
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                  className="group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fittingType="fill"
                      className="w-full h-full object-cover grayscale-[20%] transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent" />
                    <div className="absolute top-4 left-4 w-11 h-11 flex items-center justify-center bg-primary text-primary-foreground">
                      <Icon size={20} />
                    </div>
                    <span className="absolute top-4 right-4 font-mono text-xs text-white/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="bg-background border border-t-0 border-border p-8">
                    <h3 className="text-2xl font-heading font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
