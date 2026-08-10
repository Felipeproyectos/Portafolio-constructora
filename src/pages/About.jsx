import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import SectionHeading from "@/components/shared/SectionHeading";
import { Target, Eye, Heart, Award } from "lucide-react";

export default function About() {
  const [info, setInfo] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [infoData, teamData] = await Promise.all([
          base44.entities.CompanyInfo.list("order", 20),
          base44.entities.TeamMember.list("order", 20),
        ]);
        setInfo(infoData);
        setTeam(teamData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const history = info.find((i) => i.section === "history");
  const mission = info.find((i) => i.section === "mission");
  const vision = info.find((i) => i.section === "vision");
  const values = info.find((i) => i.section === "values");
  const experience = info.find((i) => i.section === "experience");

  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="py-20 lg:py-28 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div initial={{ width: 0 }} animate={{ width: 64 }} transition={{ duration: 0.6 }} className="h-px bg-primary mb-8" />
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-4">
            Nuestra Historia
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight max-w-4xl">
            Más de dos décadas construyendo el futuro.
          </motion.h1>
        </div>
      </section>

      {/* HISTORY */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Historia" title="Nuestra trayectoria" />
            </div>
            <div className="lg:col-span-7">
              {history ? (
                <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">{history.content}</p>
              ) : (
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Fundada hace más de dos décadas, nuestra constructora ha crecido desde sus inicios como una pequeña
 empresa familiar hasta convertirse en un referente regional en construcción e infraestructura. Cada proyecto
 que emprendemos refleja nuestro compromiso con la calidad, la seguridad y la satisfacción del cliente. Hemos
 construido más de 120 proyectos, desde viviendas residenciales hasta grandes obras de infraestructura pública,
 siempre con la misma filosofía: hacer las cosas bien, desde el primer día.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION / VISION / VALUES */}
      <section className="py-24 lg:py-32 bg-foreground text-background">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Target, data: mission, fallback: { title: "Misión", content: "Construir espacios que transformen comunidades, entregando proyectos de máxima calidad, en plazo y con estándares de seguridad superiores, superando las expectativas de nuestros clientes." } },
              { icon: Eye, data: vision, fallback: { title: "Visión", content: "Ser la constructora líder y referente regional en calidad y confianza, reconocida por nuestra capacidad técnica, innovación y compromiso con el desarrollo sustentable." } },
              { icon: Heart, data: values, fallback: { title: "Valores", content: "Integridad, excelencia, seguridad, compromiso social y respeto por el medio ambiente. Estos principios guían cada decisión y cada obra que emprendemos." } },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <item.icon size={32} className="text-primary mb-6" />
                <h3 className="text-2xl font-heading font-bold mb-4">{item.data?.title || item.fallback.title}</h3>
                <p className="text-background/70 leading-relaxed">{item.data?.content || item.fallback.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <SectionHeading
            eyebrow="Equipo"
            title="Profesionales detrás de cada obra"
            description="Un equipo multidisciplinario con la experiencia para hacer realidad cualquier desafío constructivo."
          />
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-muted animate-pulse" />)}
            </div>
          ) : team.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-muted mb-4">
                    {member.photo_url ? (
                      <Image src={member.photo_url} alt={member.name} fittingType="fill" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-mono text-xs text-muted-foreground">SIN FOTO</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading font-semibold">{member.name}</h3>
                  <p className="font-mono text-xs text-muted-foreground mt-1">{member.role}</p>
                  {member.bio && <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { name: "Nombre Apellido", role: "Gerente General" },
                { name: "Nombre Apellido", role: "Director de Obras" },
                { name: "Nombre Apellido", role: "Jefe de Proyectos" },
                { name: "Nombre Apellido", role: "Arquitecto Jefe" },
              ].map((m, i) => (
                <div key={i}>
                  <div className="aspect-[3/4] bg-muted mb-4 flex items-center justify-center">
                    <span className="font-mono text-xs text-muted-foreground">FOTO</span>
                  </div>
                  <h3 className="font-heading font-semibold">{m.name}</h3>
                  <p className="font-mono text-xs text-muted-foreground mt-1">{m.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}