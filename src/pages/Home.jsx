import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown, Building2, Calendar, Ruler, Users, Award, HardHat, Briefcase } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import SectionHeading from "@/components/shared/SectionHeading";
import StatCounter from "@/components/shared/StatCounter";
import ProjectCard from "@/components/shared/ProjectCard";

const ICON_MAP = { building: Building2, calendar: Calendar, ruler: Ruler, users: Users, award: Award, hardhat: HardHat, briefcase: Briefcase };

const HERO_IMAGE = "https://images.unsplash.com/photo-1503387762-592deb58ef4?w=1920&q=85";
const LOGO_URL = "https://media.base44.com/images/public/6a7a0d673c6e832f34f21db3/a33f0ae2c_WhatsAppImage2026-08-06at93236AM.jpg";

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], ["0%", "30%"]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 1.15]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    async function loadData() {
      try {
        const [projects, statsData] = await Promise.all([
          base44.entities.Project.filter({ is_featured: true, is_published: true }, "-year", 6),
          base44.entities.CompanyStat.list("order", 10),
        ]);
        setFeaturedProjects(projects);
        setStats(statsData);
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Image
              src={LOGO_URL}
              fittingType="fit"
              alt="Constructora AvenZinc"
              className="h-28 w-80 rounded-sm bg-white/95 p-3 shadow-2xl"
            />
          </motion.div>
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50"
        >
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ArrowDown size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="py-24 lg:py-32 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-muted animate-pulse" />)}
            </div>
          ) : stats.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {stats.map((stat) => {
                const Icon = ICON_MAP[stat.icon?.toLowerCase()] || Building2;
                return (
                  <div key={stat.id} className="border-l-2 border-border pl-6">
                    <StatCounter value={stat.value} label={stat.label} suffix="+" icon={Icon} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {[
                { value: "120", label: "Proyectos ejecutados", icon: Building2 },
                { value: "25", label: "Años de experiencia", icon: Calendar },
                { value: "480", label: "miles de m² construidos", icon: Ruler },
                { value: "80", label: "Profesionales", icon: Users },
              ].map((stat, i) => (
                <div key={i} className="border-l-2 border-border pl-6">
                  <StatCounter value={stat.value} label={stat.label} suffix={i === 2 ? "K" : "+"} icon={stat.icon} />
                </div>
              ))}
            </div>
          )}
        </div>
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
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p className="font-mono text-sm">Próximamente: proyectos siendo cargados.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}