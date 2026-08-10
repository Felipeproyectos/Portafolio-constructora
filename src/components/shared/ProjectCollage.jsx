import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";

export default function ProjectCollage({ projects, loading }) {
  if (loading || !projects || projects.length === 0) {
    return (
      <div className="grid grid-cols-4 grid-rows-3 gap-1.5 h-[480px] md:h-[560px]">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="bg-white/10 animate-pulse" />
        ))}
      </div>
    );
  }

  const photos = projects.filter((p) => p.displayImage || p.cover_image).slice(0, 7);
  if (photos.length === 0) return null;

  // Masonry-lite layout: 4 cols × 3 rows
  // [0 0] [1 1]
  // [0 0] [2] [3]
  // [4] [5] [6 6]
  const layoutClasses = [
    "col-span-2 row-span-2",
    "col-span-2 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-2 row-span-1",
  ];

  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-1.5 h-[480px] md:h-[560px]">
      {photos.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.07 }}
          className={`relative overflow-hidden group ${layoutClasses[i] || "col-span-1 row-span-1"}`}
        >
          <Link to={`/proyectos/${project.slug}`} className="block w-full h-full">
            <Image
              src={project.displayImage || project.cover_image}
              alt={project.name}
              fittingType="fill"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 opacity-80 group-hover:opacity-90 transition-opacity" />

            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white z-10">
              {project.location && (
                <p className="font-mono text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-[#F5B01D] mb-1">
                  {project.location}
                </p>
              )}
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