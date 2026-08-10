import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Image } from "@/components/ui/image";
import WatermarkLogo from "@/components/shared/WatermarkLogo";

export default function Lightbox({ images, index, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(index);
  const [zoomed, setZoomed] = useState(false);

  const goNext = useCallback(() => {
    setZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  const current = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-foreground/95 backdrop-blur-sm flex items-center justify-center"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all z-10"
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all z-10"
          aria-label="Anterior"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all z-10"
          aria-label="Siguiente"
        >
          <ChevronRight size={28} />
        </button>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-7xl max-h-[85vh] w-full mx-16"
          onClick={(e) => e.stopPropagation()}
        >
          {current && (
            <>
              <div className={`relative ${zoomed ? "overflow-auto" : "overflow-hidden"} max-h-[75vh]`}>
                <Image
                  src={current.url || current}
                  alt={current.caption || ""}
                  fittingType="fit"
                  className={`w-full h-full object-contain transition-transform duration-300 ${zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"}`}
                />
                <div className="absolute top-4 right-4 pointer-events-none drop-shadow-2xl">
                  <WatermarkLogo size={88} className="opacity-95" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-white">
                <div>
                  {current.caption && (
                    <p className="text-sm text-white/80">{current.caption}</p>
                  )}
                  <p className="font-mono text-xs text-white/40 mt-1">
                    {currentIndex + 1} / {images.length}
                  </p>
                </div>
                <button
                  onClick={() => setZoomed(!zoomed)}
                  className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  {zoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}