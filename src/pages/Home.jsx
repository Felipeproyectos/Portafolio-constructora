import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import SectionHeading from "@/components/shared/SectionHeading";
import ProjectCard from "@/components/shared/ProjectCard";
import WatermarkLogo from "@/components/shared/WatermarkLogo";

const HERO_IMAGE = "https://base44.app/api/apps/6a7a0d673c6e832f34f21db3/files/mp/public/6a7a0d673c6e832f34f21db3/678c50aee_IMG-20221011-WA0008.jpg";
const LOGO_URL = "https://media.base44.com/images/public/6a7a0d673c6e832f34f21db3/a33f0ae2c_WhatsAppImage2026-08-06at93236AM.jpg";

// Asymmetric 4x3 collage grid — same pattern as ProjectCollage.jsx
const COLLAGE_LAYOUT = [
  "col-span-2 row-span-2",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
];

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    async function loadData() {
      try {
        const [projects, companyStats] = await Promise.all([
          base44.entities.Project.filter({ is_featured: true, is_published: true }, "-year", 7),
          base44.entities.CompanyStat.list("order", 20),
        ]);
        setFeaturedProjects(projects);
        setStats(companyStats);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const collagePhotos = [...featuredProjects.map((p) => p.cover_image).filter(Boolean)];
  while (collagePhotos.length < 7) collagePhotos.push(HERO_IMAGE);

  return (
    <div>
      {/* HERO */}
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

        <div className="absolute top-24 right-8 lg:right-12 z-10 drop-shadow-2xl">
          <WatermarkLogo width={140} className="opacity-90" />
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 h-full flex flex-col justify-center max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-8 h-px bg-primary" />
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-primary">
              Constructora AvenZinc
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight text-white max-w-4xl leading-[0.95]"
          >
            Construimos espacios que <span className="italic font-normal text-white/85">transforman.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-8 max-w-xl text-base md:text-lg text-white/75 leading-relaxed"
          >
            Más de dos décadas construyendo viviendas, cabañas y obras a medida en la región de Los Ríos. Explore el portafolio completo de proyectos entregados.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/proyectos"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-medium hover:brightness-110 transition-all duration-300"
            >
              <span>Ver proyectos</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {stats.length > 0 && (
          <div className="absolute bottom-0 inset-x-0 z-10 flex flex-wrap border-t border-white/15 bg-foreground/40 backdrop-blur-md">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="flex-1 basis-1/2 sm:basis-0 px-6 lg:px-10 py-5 border-r border-b sm:border-b-0 border-white/10 last:border-r-0"
              >
                <div className="text-xl md:text-2xl font-heading font-semibold text-white">{stat.value}</div>
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/55 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
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