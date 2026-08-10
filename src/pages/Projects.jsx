import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import ProjectCard from "@/components/shared/ProjectCard";
import ProjectCollage from "@/components/shared/ProjectCollage";

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

  return (
    <div>
      {/* HEADER + COLLAGE — Dark theme */}
      <section className="bg-foreground pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.6 }}
                className="h-px bg-primary mb-8"
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-6"
              >
                — Portafolio de Obras
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-white leading-[1.05]"
              >
                Construcción y remodelación{" "}
                <span className="italic font-normal text-white/85">con sello propio.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 text-base md:text-lg text-white/60 max-w-md leading-relaxed"
              >
                Explore el catálogo completo de nuestros proyectos. Cada obra cuenta una historia de transformación, desde el primer trazo hasta la entrega final.
              </motion.p>
            </div>
            <div className="lg:col-span-7">
              <ProjectCollage projects={projects} loading={loading} />
            </div>
          </div>
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