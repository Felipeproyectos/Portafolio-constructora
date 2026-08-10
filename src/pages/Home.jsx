import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import SectionHeading from "@/components/shared/SectionHeading";
import ProjectCard from "@/components/shared/ProjectCard";

const HERO_IMAGE = "https://base44.app/api/apps/6a7a0d673c6e832f34f21db3/files/mp/public/6a7a0d673c6e832f34f21db3/678c50aee_IMG-20221011-WA0008.jpg";
const LOGO_URL = "https://media.base44.com/images/public/6a7a0d673c6e832f34f21db3/a33f0ae2c_WhatsAppImage2026-08-06at93236AM.jpg";

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], ["0%", "30%"]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 1.15]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    async function loadData() {
      try {
        const projects = await base44.entities.Project.filter({ is_featured: true, is_published: true }, "-year", 6);
        setFeaturedProjects(projects);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-screen overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <Image src={HERO_IMAGE} alt="Obra constructora" fittingType="fill" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-foreground/80" />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 h-full flex flex-col justify-center max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-mono text-xs tracking-[0.3em] uppercase text-white/70 mb-6"
          >
            Constructora AvenZinc · Portafolio Digital
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight text-white max-w-4xl leading-[0.95]"
          >
            Construimos espacios que transforman.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/proyectos"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-foreground font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <span>Ver nuestros proyectos</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        <Link
          to="/proyectos"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ArrowDown size={16} />
          </motion.div>
        </Link>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <SectionHeading
              eyebrow="Proyectos destacados"
              title="Obras que definen nuestra experiencia"
              description="Cada proyecto es una historia de transformación. Explore una selección de nuestras obras más significativas."
            />
            <Link
              to="/proyectos"
              className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors shrink-0"
            >
              <span>Ver todos los proyectos</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <div key={i} className="aspect-[4/5] bg-muted animate-pulse" />)}
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.slice(0, 3).map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

    </div>
  );
}