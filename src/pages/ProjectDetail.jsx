import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Ruler, Clock, FileText, Video, ArrowLeft, Download, Eye } from "lucide-react";
import { getProjectTypeLabel } from "@/lib/projectUtils";
import MasonryGallery from "@/components/shared/MasonryGallery";
import BeforeAfterSlider from "@/components/shared/BeforeAfterSlider";
import Lightbox from "@/components/shared/Lightbox";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [stages, setStages] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxPhotos, setLightboxPhotos] = useState(null);
  const [activeTab, setActiveTab] = useState("timeline");

  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-82%"]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    async function loadData() {
      try {
        const projectData = await base44.entities.Project.filter({ slug, is_published: true }, null, 1);
        if (!projectData || projectData.length === 0) { setLoading(false); return; }
        const proj = projectData[0];
        setProject(proj);

        const [stageData, photoData, docData, videoData] = await Promise.all([
          base44.entities.ProjectStage.filter({ project_id: proj.id }, "order", 50),
          base44.entities.ProjectPhoto.filter({ project_id: proj.id }, "order", 200),
          base44.entities.ProjectDocument.filter({ project_id: proj.id }, "order", 50),
          base44.entities.ProjectVideo.filter({ project_id: proj.id }, "order", 50),
        ]);
        setStages(stageData);
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

  const beforePhoto = photos.find((p) => p.type === "before");
  const afterPhoto = photos.find((p) => p.type === "after");
  const generalPhotos = photos.filter((p) => p.type === "general" || !p.type);

  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image src={project.cover_image} alt={project.name} fittingType="fill" className="w-full h-full object-cover" />
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
      {project.description && (
        <section className="border-b border-border bg-background">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {project.description}
            </p>
          </div>
        </section>
      )}

      {/* TABS */}
      <section className="sticky top-20 z-30 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {[
              { key: "timeline", label: "Línea de tiempo", icon: Clock },
              { key: "gallery", label: "Galería", icon: Eye },
              { key: "beforeafter", label: "Antes y Después", icon: Ruler },
              ...(documents.length > 0 ? [{ key: "docs", label: "Documentación", icon: FileText }] : []),
              ...(videos.length > 0 ? [{ key: "videos", label: "Videos", icon: Video }] : []),
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  document.getElementById(tab.key)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE (Horizontal Scrubbing) */}
      {stages.length > 0 && (
        <section id="timeline" ref={timelineRef} className="relative" style={{ height: `${stages.length * 80}vh` }}>
          <div className="sticky top-0 h-screen flex items-center overflow-hidden">
            <div className="absolute top-20 left-0 right-0 z-10 px-6 lg:px-10">
              <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-2">Línea de tiempo</p>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold">De cero a obra terminada</h2>
                </div>
                <p className="hidden md:block font-mono text-xs text-muted-foreground">Scroll para recorrer →</p>
              </div>
            </div>

            <motion.div style={{ x }} className="flex gap-6 lg:gap-10 pl-6 lg:pl-10">
              {stages.map((stage, i) => {
                const stagePhotos = photos.filter((p) => p.stage_id === stage.id);
                return (
                  <div key={stage.id} className="w-[85vw] md:w-[60vw] lg:w-[45vw] shrink-0">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-mono text-5xl lg:text-6xl font-bold text-border">
                        {String(stage.order).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-heading font-bold">{stage.title}</h3>
                        {stage.start_date && (
                          <p className="font-mono text-xs text-muted-foreground mt-1">
                            {stage.start_date} {stage.end_date ? `→ ${stage.end_date}` : ""}
                          </p>
                        )}
                      </div>
                    </div>
                    {stage.description && (
                      <p className="text-muted-foreground mb-6 max-w-md">{stage.description}</p>
                    )}
                    {stagePhotos.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {stagePhotos.slice(0, 4).map((photo, j) => (
                          <div
                            key={photo.id}
                            onClick={() => {
                              const allStagePhotos = stagePhotos;
                              setLightboxIndex(j);
                              setLightboxPhotos(allStagePhotos);
                            }}
                            className={`relative overflow-hidden bg-muted cursor-pointer group ${j === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[4/3]"}`}
                          >
                            <Image src={photo.url} alt={photo.caption || ""} fittingType="fill" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            {photo.caption && (
                              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-xs text-white">{photo.caption}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-muted flex items-center justify-center">
                        <span className="font-mono text-xs text-muted-foreground">Sin fotografías</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>

            <div className="absolute bottom-8 left-0 right-0 px-6 lg:px-10">
              <div className="max-w-[1400px] mx-auto">
                <div className="h-px bg-border relative">
                  <motion.div style={{ width: progressWidth }} className="absolute top-0 left-0 h-px bg-primary" />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-mono text-[10px] text-muted-foreground">INICIO</span>
                  <span className="font-mono text-[10px] text-muted-foreground">OBRA TERMINADA</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {generalPhotos.length > 0 && (
        <section id="gallery" className="py-24 lg:py-32">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-4 mb-12">
              <span className="font-mono text-sm text-primary">Galería</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-12 max-w-2xl">Galería fotográfica del proyecto</h2>
            <MasonryGallery photos={generalPhotos} groupByStage={false} />
          </div>
        </section>
      )}

      {/* BEFORE / AFTER */}
      {beforePhoto && afterPhoto && (
        <section id="beforeafter" className="py-24 lg:py-32 bg-foreground text-background">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-4 mb-12">
              <span className="font-mono text-sm text-primary">Comparación</span>
              <div className="flex-1 h-px bg-background/20" />
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-12 max-w-2xl">Antes y después</h2>
            <p className="text-background/60 mb-10 max-w-xl">
              Arrastre el control deslizante para comparar el terreno inicial con la obra terminada.
            </p>
            <BeforeAfterSlider beforeImage={beforePhoto.url} afterImage={afterPhoto.url} />
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