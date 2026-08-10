import { useState } from "react";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import Lightbox from "@/components/shared/Lightbox";

export default function MasonryGallery({ photos, groupByStage = false, stages = [] }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (groupByStage && stages.length > 0) {
    return (
      <div className="space-y-16">
        {stages.map((stage) => {
          const stagePhotos = photos.filter((p) => p.stage_id === stage.id);
          if (stagePhotos.length === 0) return null;
          return (
            <div key={stage.id}>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-mono text-sm text-primary">
                  {String(stage.order).padStart(2, "0")}
                </span>
                <h3 className="text-2xl font-heading font-semibold">{stage.title}</h3>
                <div className="flex-1 h-px bg-border" />
                <span className="font-mono text-xs text-muted-foreground">
                  {stagePhotos.length} {stagePhotos.length === 1 ? "foto" : "fotos"}
                </span>
              </div>
              <GalleryGrid photos={stagePhotos} onOpenLightbox={setLightboxIndex} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <GalleryGrid photos={photos} onOpenLightbox={setLightboxIndex} />
      {lightboxIndex !== null && (
        <Lightbox
          images={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

function GalleryGrid({ photos, onOpenLightbox }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
      {photos.map((photo, i) => (
        <motion.div
          key={photo.id || i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
          className="relative break-inside-avoid overflow-hidden bg-muted group cursor-pointer"
          onClick={() => onOpenLightbox(i)}
        >
          <Image
            src={photo.url || photo}
            alt={photo.caption || ""}
            fittingType="fit"
            className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {photo.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm text-white">{photo.caption}</p>
            </div>
          )}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
        </motion.div>
      ))}
    </div>
  );
}