import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import ProjectCard from "@/components/shared/ProjectCard";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await base44.entities.Project.filter({ is_published: true }, "-year", 200);
        setProjects(data);
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
      {/* HEADER */}
      <section className="py-20 lg:py-28 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div initial={{ width: 0 }} animate={{ width: 64 }} transition={{ duration: 0.6 }} className="h-px bg-primary mb-8" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-4"
          >
            Portafolio de Obras
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight max-w-4xl"
          >
            De cero a obra terminada.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl"
          >
            Explore el catálogo completo de nuestros proyectos. Cada obra cuenta una historia de transformación.
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