import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import SectionHeading from "@/components/shared/SectionHeading";
import { Image } from "@/components/ui/image";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await base44.entities.Client.list("order", 50);
        setClients(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="pt-20">
      <section className="py-20 lg:py-28 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div initial={{ width: 0 }} animate={{ width: 64 }} transition={{ duration: 0.6 }} className="h-px bg-primary mb-8" />
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-4">
            Nuestros Clientes
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight max-w-4xl">
            La confianza de quienes nos eligen.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Empresas, instituciones y mandantes que han confiado en nuestra experiencia para hacer realidad sus proyectos.
          </motion.p>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
              {[...Array(8)].map((_, i) => <div key={i} className="aspect-[2/1] bg-background animate-pulse" />)}
            </div>
          ) : clients.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
              {clients.map((client, i) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                  className="group bg-background aspect-[2/1] flex items-center justify-center p-8 hover:bg-muted/50 transition-colors"
                >
                  {client.logo_url ? (
                    <Image src={client.logo_url} alt={client.name} fittingType="fit" className="max-h-20 max-w-[80%] object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <span className="font-heading font-bold text-xl text-muted-foreground group-hover:text-foreground transition-colors">
                      {client.name}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
              {["Municipalidad de Santiago", "Empresa Constructora ABC", "Inmobiliaria XYZ", "Ministerio de Obras Públicas", "Grupo Inmobiliario DEF", "Cámara Chilena de la Construcción", "Universidad de Chile", "Empresa Portuaria"].map((name, i) => (
                <div key={i} className="bg-background aspect-[2/1] flex items-center justify-center p-8">
                  <span className="font-heading font-bold text-lg text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}