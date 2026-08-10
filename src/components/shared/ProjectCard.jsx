import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import { getProjectTypeLabel, getProjectStatusLabel } from "@/lib/projectUtils";
import WatermarkLogo from "@/components/shared/WatermarkLogo";

export default function ProjectCard({ project, index = 0 }) {
  const aspectClass = index % 3 === 0 ? "aspect-[4/5]" : index % 3 === 1 ? "aspect-[4/3]" : "aspect-[1/1]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      className="group"
    >
      <Link to={`/proyectos/${project.slug}`} className="block">
        <div className={`relative overflow-hidden bg-muted ${aspectClass}`}>
          {project.cover_image ? (
            <Image
              src={project.cover_image}
              alt={project.name}
              fittingType="fill"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="font-mono text-xs text-muted-foreground">SIN IMAGEN</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/0 to-foreground/0 opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

          <div className="absolute top-3 right-3 drop-shadow-2xl">
            <WatermarkLogo width={64} className="opacity-95 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className={`px-3 py-1 text-[10px] font-mono tracking-[0.15em] uppercase ${
              project.status === "completed"
                ? "bg-background/90 text-foreground"
                : "bg-primary text-primary-foreground"
            }`}>
              {getProjectStatusLabel(project.status)}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="overflow-hidden">
              <motion.div
                initial={false}
                className="transform transition-transform duration-500"
              >
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/70 mb-2">
                  {getProjectTypeLabel(project.type)} · {project.year}
                </p>
                <h3 className="text-xl md:text-2xl font-heading font-semibold leading-tight mb-2">
                  {project.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <MapPin size={14} />
                  <span>{project.location}</span>
                </div>
              </motion.div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              <span>Ver proyecto</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}