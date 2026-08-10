import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import WatermarkLogo from "@/components/shared/WatermarkLogo";

export default function ProjectCollage({ projects, loading }) {
  if (loading || !projects || projects.length === 0) {
    return (
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px]">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  const photos = projects.filter((p) => p.cover_image).slice(0, 7);

  if (photos.length === 0) return null;

  // Collage layout: 4 columns, 2 rows
  // First image spans 2 cols + 2 rows (large), rest fill remaining cells
  const layoutClasses = [
    "col-span-2 row-span-2", // 0: large left
    "col-span-1 row-span-1", // 1
    "col-span-1 row-span-1", // 2
    "col-span-2 row-span-1", // 3: wide
    "col-span-1 row-span-1", // 4
    "col-span-1 row-span-1", // 5
    "col-span-2 row-span-1", // 6: wide (if 7 items)
  ];

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px]">
      {photos.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className={`relative overflow-hidden group ${layoutClasses[i] || "col-span-1 row-span-1"}`}
        >
          <Link to={`/proyectos/${project.slug}`} className="block w-full h-full">
            <Image
              src={project.cover_image}
              alt={project.name}
              fittingType="fill"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/0 to-foreground/0 opacity-70 group-hover:opacity-90 transition-opacity" />

            <div className="absolute top-2 right-2">
              <WatermarkLogo width={40} className="opacity-90" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
              <p className="font-mono text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-white/70 mb-1">
                {project.location || "Obra"}
              </p>
              <h3 className="text-xs md:text-sm font-heading font-semibold leading-tight line-clamp-2">
                {project.name}
              </h3>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}