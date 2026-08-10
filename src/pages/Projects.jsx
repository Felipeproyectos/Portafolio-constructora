import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import ProjectCard from "@/components/shared/ProjectCard";

// Mismo patrón de collage asimétrico 4x3 que el hero de Home, para un estilo único entre páginas.
const COLLAGE_LAYOUT = [
  "col-span-2 row-span-2",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await base44.entities.Project.filter({ is_published: true }, "-year", 200);
        // Fetch general photos to show finished work in the collage
        const photos = await base44.entities.ProjectPhoto.filter({ type: "general" }, null, 500);
        const photoMap = {};
        photos.forEach((p) => {
          if (!photoMap[p.project_id]) photoMap[p.project_id] = p.url;
        });
        const enriched = data.map((p) => ({
          ...p,
          displayImage: photoMap[p.id] || p.cover_image,
        }));
        setProjects(enriched);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const collagePhotos = projects.slice(0, 7).map((p) => p.displayImage || p.cover_image).filter(Boolean);

  return (
    <div>
      {/* HERO — mismo estilo de collage a pantalla completa que Home */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-0.5">
          {collagePhotos.map((src, i) => (
            <div key={i} className={`relative overflow-hidden ${COLLAGE_LAYOUT[i]}`}>
              <Image
                src={src}
                alt=""
                fittingType="fill"
                className="w-full h-full object-cover grayscale-[35%] brightness-[0.62] contrast-[1.05]"
              />
            </div>
          ))}
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--foreground)/0.55) 0%, hsl(var(--foreground)/0.35) 35%, hsl(var(--foreground)/0.85) 100%), linear-gradient(90deg, hsl(var(--foreground)/0.5) 0%, transparent 40%, transparent 60%, hsl(var(--foreground)/0.5) 100%)",
          }}
        />

        <div className="relative z-10 h-full flex flex-col justify-center max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 32 }}
            transition={{ duration: 0.6 }}
            className="h-px bg-primary mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-6"
          >
            Portafolio de obras
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight text-white max-w-4xl leading-[1.05] md:leading-[0.95]"
          >
            Construcción y remodelación <span className="italic font-normal text-white/85">con sello propio.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 max-w-xl text-base md:text-lg text-white/75 leading-relaxed"
          >
            Explore el catálogo completo de nuestros proyectos. Cada obra cuenta una historia de transformación, desde el primer trazo hasta la entrega final.
          </motion.p>
        </div>
      </section>

      {/* GRID */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="aspect-[4/5] bg-muted animate-pulse" />)}
            </div>
          ) : projects.length > 0 ? (
            <>
              <p className="font-mono text-xs text-muted-foreground mb-8">
                {projects.length} {projects.length === 1 ? "proyecto" : "proyectos"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-32">
              <p className="font-mono text-sm text-muted-foreground mb-2">Sin resultados</p>
              <p className="text-lg">No hay proyectos publicados todavía.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}