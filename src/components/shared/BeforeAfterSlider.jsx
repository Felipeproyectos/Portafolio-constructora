import { useRef, useState } from "react";
import { Image } from "@/components/ui/image";

export default function BeforeAfterSlider({ beforeImage, afterImage, beforeLabel = "Antes", afterLabel = "Después" }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    handleMove(e.clientX);
  };

  const handleTouchStart = (e) => {
    isDragging.current = true;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (isDragging.current) handleMove(e.touches[0].clientX);
  };

  const stopDragging = () => { isDragging.current = false; };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] overflow-hidden bg-muted cursor-ew-resize select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={stopDragging}
    >
      <div className="absolute inset-0">
        <Image src={afterImage} alt={afterLabel} fittingType="fill" className="w-full h-full object-cover" />
        <span className="absolute top-4 right-4 px-3 py-1 bg-foreground/80 text-white font-mono text-[10px] tracking-[0.15em] uppercase">
          {afterLabel}
        </span>
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div className="relative h-full" style={{ width: `${containerRef.current?.clientWidth || 100}%` }}>
          <Image src={beforeImage} alt={beforeLabel} fittingType="fill" className="w-full h-full object-cover" />
          <span className="absolute top-4 left-4 px-3 py-1 bg-foreground/80 text-white font-mono text-[10px] tracking-[0.15em] uppercase">
            {beforeLabel}
          </span>
        </div>
      </div>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
          <div className="flex items-center gap-0.5 text-foreground">
            <span className="text-xs">◀</span>
            <span className="text-xs">▶</span>
          </div>
        </div>
      </div>
    </div>
  );
}