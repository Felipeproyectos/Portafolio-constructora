import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image } from "@/components/ui/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MagazineGallery({ photos }) {
  const isMobile = useIsMobile();
  const [currentSpread, setCurrentSpread] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const spreadSize = isMobile ? 1 : 2;
  const spreads = [];
  for (let i = 0; i < photos.length; i += spreadSize) {
    spreads.push(photos.slice(i, i + spreadSize));
  }

  const totalSpreads = spreads.length;
  const current = spreads[currentSpread] || [];
  const canGoNext = currentSpread < totalSpreads - 1;
  const canGoPrev = currentSpread > 0;

  useEffect(() => {
    if (currentSpread >= totalSpreads && totalSpreads > 0) {
      setCurrentSpread(Math.max(0, totalSpreads - 1));
    }
  }, [totalSpreads, currentSpread]);

  const goNext = () => {
    if (canGoNext && !isFlipping) {
      setDirection(1);
      if (isMobile) {
        setCurrentSpread((s) => s + 1);
      } else {
        setIsFlipping(true);
      }
    }
  };

  const goPrev = () => {
    if (canGoPrev && !isFlipping) {
      setDirection(-1);
      if (isMobile) {
        setCurrentSpread((s) => s - 1);
      } else {
        setIsFlipping(true);
      }
    }
  };

  const handleFlipComplete = () => {
    if (direction === 1) setCurrentSpread((s) => s + 1);
    else if (direction === -1) setCurrentSpread((s) => s - 1);
    setIsFlipping(false);
  };

  const leftPageNum = currentSpread * spreadSize + 1;
  const rightPageNum = currentSpread * spreadSize + spreadSize;
  const totalPages = photos.length;

  // Mobile: single page with slide
  if (isMobile) {
    return (
      <div className="relative w-full">
        <div className="relative aspect-[3/4] max-w-sm mx-auto bg-card overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSpread}
              custom={direction}
              initial={{ opacity: 0, x: direction >= 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction >= 0 ? -60 : 60 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              {current[0] && (
                <Image src={current[0].url} alt={current[0].caption || ""} fittingType="fill" className="block w-full h-full" />
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-xs text-white/70 z-10">
            {leftPageNum} / {totalPages}
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={goPrev}
            disabled={!canGoPrev}
            className="w-11 h-11 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-mono text-sm text-muted-foreground min-w-[60px] text-center">
            {leftPageNum} / {totalPages}
          </span>
          <button
            onClick={goNext}
            disabled={!canGoNext}
            className="w-11 h-11 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // Desktop: two-page book with 3D flip
  return (
    <div className="relative w-full">
      <div className="relative max-w-5xl mx-auto" style={{ perspective: "2500px" }}>
        <div className="relative aspect-[16/10] grid grid-cols-2 gap-0 shadow-2xl bg-card">
          {/* Left page */}
          <div className="relative overflow-hidden cursor-pointer group" onClick={goPrev}>
            {current[0] && (
              <Image src={current[0].url} alt={current[0].caption || ""} fittingType="fill" className="block w-full h-full" />
            )}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-xs text-white/70 z-10">
              {leftPageNum}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/25 to-transparent pointer-events-none" />
            {canGoPrev && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none">
                <ChevronLeft className="opacity-0 group-hover:opacity-60 transition-opacity text-white" size={40} />
              </div>
            )}
          </div>

          {/* Right page */}
          <div className="relative overflow-hidden cursor-pointer group" onClick={goNext}>
            {current[1] ? (
              <Image src={current[1].url} alt={current[1].caption || ""} fittingType="fill" className="block w-full h-full" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="font-mono text-sm text-muted-foreground">— Fin —</span>
              </div>
            )}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-xs text-white/70 z-10">
              {Math.min(rightPageNum, totalPages)}
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />
            {canGoNext && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none">
                <ChevronRight className="opacity-0 group-hover:opacity-60 transition-opacity text-white" size={40} />
              </div>
            )}
          </div>

          {/* Flipping page - forward (right page flips left) */}
          {isFlipping && direction === 1 && spreads[currentSpread + 1] && (
            <motion.div
              className="absolute top-0 right-0 w-1/2 h-full z-20"
              style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -180 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              onAnimationComplete={handleFlipComplete}
            >
              <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
                {current[1] && (
                  <Image src={current[1].url} alt="" fittingType="fill" className="block w-full h-full" />
                )}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/40 to-transparent" />
              </div>
              <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                {spreads[currentSpread + 1][0] && (
                  <Image src={spreads[currentSpread + 1][0].url} alt="" fittingType="fill" className="block w-full h-full" />
                )}
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/40 to-transparent" />
              </div>
            </motion.div>
          )}

          {/* Flipping page - backward (left page flips right) */}
          {isFlipping && direction === -1 && spreads[currentSpread - 1] && (
            <motion.div
              className="absolute top-0 left-0 w-1/2 h-full z-20"
              style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 180 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              onAnimationComplete={handleFlipComplete}
            >
              <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
                {current[0] && (
                  <Image src={current[0].url} alt="" fittingType="fill" className="block w-full h-full" />
                )}
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/40 to-transparent" />
              </div>
              <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                {spreads[currentSpread - 1][1] && (
                  <Image src={spreads[currentSpread - 1][1].url} alt="" fittingType="fill" className="block w-full h-full" />
                )}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/40 to-transparent" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Center spine */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-black/30 pointer-events-none z-30" />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <button
          onClick={goPrev}
          disabled={!canGoPrev || isFlipping}
          className="w-12 h-12 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="font-mono text-sm text-muted-foreground min-w-[80px] text-center">
          {leftPageNum}–{Math.min(rightPageNum, totalPages)} / {totalPages}
        </span>
        <button
          onClick={goNext}
          disabled={!canGoNext || isFlipping}
          className="w-12 h-12 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}