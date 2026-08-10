import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import WatermarkLogo from "@/components/shared/WatermarkLogo";

export default function CarouselGallery({ photos, onImageClick }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  const total = photos.length;

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goToPrev, goToNext]);

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    setTouchStart(null);
  };

  if (total === 0) return null;

  const photo = photos[current];

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Main image */}
      <div
        className="relative aspect-[16/10] md:aspect-[16/9] bg-foreground overflow-hidden cursor-pointer group"
        onClick={() => onImageClick?.(current)}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={photo.url}
              alt={photo.caption || ""}
              fittingType="fill"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-4 right-4 pointer-events-none drop-shadow-2xl z-10">
          <WatermarkLogo width={88} className="opacity-95" />
        </div>

        {photo.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent">
            <p className="text-sm text-white">{photo.caption}</p>
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); goToPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-background/80 hover:bg-background text-foreground transition-colors z-10"
          aria-label="Anterior"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); goToNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-background/80 hover:bg-background text-foreground transition-colors z-10"
          aria-label="Siguiente"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Counter + thumbnails */}
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">
            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div className="flex-1 h-px bg-border mx-6" />
          <span className="font-mono text-xs text-muted-foreground hidden md:block">Use ← → para navegar</span>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {photos.map((p, i) => (
            <button
              key={p.id || i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`relative shrink-0 w-20 h-14 overflow-hidden transition-all ${
                i === current ? "ring-2 ring-primary" : "opacity-50 hover:opacity-100"
              }`}
            >
              <Image src={p.url} alt="" fittingType="fill" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}