import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { FileText, ArrowLeft, Download, Check } from "lucide-react";
import { getProjectTypeLabel, dedupePhotosByOriginalFilename, parseDescription } from "@/lib/projectUtils";
import CarouselGallery from "@/components/shared/CarouselGallery";
import Lightbox from "@/components/shared/Lightbox";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxPhotos, setLightboxPhotos] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const projectData = await base44.entities.Project.filter({ slug, is_published: true }, null, 1);
        if (!projectData || projectData.length === 0) { setLoading(false); return; }
        const proj = projectData[0];
        setProject(proj);

        const [photoData, docData, videoData] = await Promise.all([
          base44.entities.ProjectPhoto.filter({ project_id: proj.id }, "order", 200),
          base44.entities.ProjectDocument.filter({ project_id: proj.id }, "order", 50),
          base44.entities.ProjectVideo.filter({ project_id: proj.id }, "order", 50),
        ]);
        setPhotos(photoData);
        setDocuments(docData);
        setVideos(videoData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-mono text-sm text-muted-foreground">404 · Proyecto no encontrado</p>
        <Link to="/proyectos" className="text-primary hover:underline">Volver al portafolio</Link>
      </div>
    );
  }

  const generalPhotos = dedupePhotosByOriginalFilename(photos.filter((p) => p.type === "general" || !p.type));
  // Fotos curadas (order < 500) se muestran primero; el resto queda detrás de "ver más".
  const curatedPhotos = generalPhotos.filter((p) => (p.order ?? 0) < 500);
  const hiddenPhotoCount = generalPhotos.length - curatedPhotos.length;
  const displayPhotos = showAllPhotos || curatedPhotos.length === 0 ? generalPhotos : curatedPhotos;

  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image src={project.cover_image} alt={project.name} fittingType="fill" loading="eager" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-foreground/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <div className="max-w-[1400px] mx-auto">
            <Link to="/proyectos" className="group inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Volver al portafolio
            </Link>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-xs tracking-[0.2em] uppercase text-white/70 mb-4"
            >
              {getProjectTypeLabel(project.type)} · {project.year}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-white max-w-4xl"
            >
              {project.name}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      {project.description && (() => {
        const desc = parseDescription(project.description);
        const hasList = desc.items.length > 0;
        return (
          <section className="border-b border-border bg-background">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
              <div className={hasList ? "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16" : ""}>
                <div className={hasList ? "lg:col-span-6" : "max-w-3xl"}>
                  {[...desc.intro, ...desc.outro].map((p, i) => (
                    <p key={i} className="text-lg text-muted-foreground leading-relaxed mb-4 last:mb-0">
                      {p}
                    </p>
                  ))}
                </div>
                {hasList && (
                  <div className="lg:col-span-6">
                    {desc.listTitle && (
                      <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-6">
                        {desc.listTitle}
                      </h3>
                    )}
                    <ul className="space-y-4">
                      {desc.items.map((item, i) => (
                        <li key={i} className="flex gap-3">
                          <Check size={18} className="text-primary shrink-0 mt-1" />
                          <p className="text-muted-foreground leading-relaxed">
                            {item.label && <span className="font-semibold text-foreground">{item.label}: </span>}
                            {item.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {/* TITLE */}
      <section className="border-b border-border bg-background">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-24 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">
            Constructora AvenZinc<br className="hidden md:block" /> ayudando a construir tus sueños
          </h2>
        </div>
      </section>

      {/* GALLERY */}
      {generalPhotos.length > 0 && (
        <section id="gallery" className="py-24 lg:py-32 bg-muted/30">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-4 mb-12">
              <span className="font-mono text-sm text-primary">Galería</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-12 max-w-2xl">Galería fotográfica del proyecto</h2>
            <CarouselGallery photos={displayPhotos} onImageClick={(i) => { setLightboxIndex(i); setLightboxPhotos(displayPhotos); }} />
            {!showAllPhotos && hiddenPhotoCount > 0 && (
              <button
                onClick={() => setShowAllPhotos(true)}
                className="mt-8 font-mono text-xs tracking-[0.15em] uppercase text-primary hover:underline"
              >
                Ver las {hiddenPhotoCount} fotos restantes
              </button>
            )}
          </div>
        </section>
      )}

      {/* DOCUMENTS */}
      {documents.length > 0 && (
        <section id="docs" className="py-24 lg:py-32">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-4 mb-12">
              <span className="font-mono text-sm text-primary">Documentación</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-12 max-w-2xl">Documentos del proyecto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-6 border border-border hover:border-foreground transition-all"
                >
                  <div className="w-12 h-12 bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{doc.title}</h3>
                    <p className="font-mono text-xs text-muted-foreground mt-1 capitalize">{doc.type.replace("_", " ")}</p>
                  </div>
                  <Download size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VIDEOS */}
      {videos.length > 0 && (
        <section id="videos" className="py-24 lg:py-32 bg-muted/30">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-4 mb-12">
              <span className="font-mono text-sm text-primary">Videos</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-12 max-w-2xl">Recorrido en video</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {videos.map((video) => (
                <div key={video.id}>
                  <div className="relative aspect-video bg-foreground overflow-hidden group">
                    {isYouTube(video.url) ? (
                      <iframe
                        src={getYouTubeEmbed(video.url)}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video src={video.url} controls className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="font-mono text-xs text-primary capitalize mb-1">{video.type}</p>
                    <h3 className="text-xl font-heading font-semibold">{video.title}</h3>
                    {video.description && <p className="text-sm text-muted-foreground mt-1">{video.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {lightboxIndex !== null && lightboxPhotos && (
        <Lightbox images={lightboxPhotos} index={lightboxIndex} onClose={() => { setLightboxIndex(null); setLightboxPhotos(null); }} />
      )}
    </div>
  );
}

function isYouTube(url) {
  return url && (url.includes("youtube.com") || url.includes("youtu.be"));
}

function getYouTubeEmbed(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}