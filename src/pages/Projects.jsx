import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import ProjectCard from "@/components/shared/ProjectCard";
import { PROJECT_TYPE_LABELS, PROJECT_STATUS_LABELS } from "@/lib/projectUtils";
import { Filter, X } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: "all", status: "all", year: "all", location: "all" });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await base44.entities.Project.filter({ is_published: true }, "-year", 100);
        setProjects(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const years = useMemo(() => [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a), [projects]);
  const locations = useMemo(() => [...new Set(projects.map((p) => p.location).filter(Boolean))], [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (filters.type !== "all" && p.type !== filters.type) return false;
      if (filters.status !== "all" && p.status !== filters.status) return false;
      if (filters.year !== "all" && String(p.year) !== filters.year) return false;
      if (filters.location !== "all" && p.location !== filters.location) return false;
      return true;
    });
  }, [projects, filters]);

  const activeFilterCount = Object.values(filters).filter((v) => v !== "all").length;

  return (
    <div className="pt-20">
      {/* HEADER */}
      <section className="py-20 lg:py-28 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div initial={{ width: 0 }} animate={{ width: 64 }} transition={{ duration: 0.6 }} className="h-px bg-primary mb-8" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-4"
          >
            Portafolio de Obras
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight max-w-4xl"
          >
            De cero a obra terminada.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl"
          >
            Explore el catálogo completo de nuestros proyectos. Cada obra cuenta una historia de transformación.
          </motion.p>
        </div>
      </section>

      {/* FILTERS */}
      <section className="sticky top-20 z-30 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
              <Filter size={16} className="text-muted-foreground shrink-0" />
              <FilterPill
                label="Todos"
                active={filters.type === "all"}
                onClick={() => setFilters({ ...filters, type: "all" })}
              />
              {Object.entries(PROJECT_TYPE_LABELS).map(([key, label]) => (
                <FilterPill
                  key={key}
                  label={label}
                  active={filters.type === key}
                  onClick={() => setFilters({ ...filters, type: key })}
                />
              ))}
            </div>
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="bg-transparent border border-border px-3 py-2 text-sm font-medium cursor-pointer hover:border-foreground transition-colors"
              >
                <option value="all">Todos los estados</option>
                {Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <select
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                className="bg-transparent border border-border px-3 py-2 text-sm font-medium cursor-pointer hover:border-foreground transition-colors"
              >
                <option value="all">Todos los años</option>
                {years.map((y) => <option key={y} value={String(y)}>{y}</option>)}
              </select>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="bg-transparent border border-border px-3 py-2 text-sm font-medium cursor-pointer hover:border-foreground transition-colors"
              >
                <option value="all">Todas las ubicaciones</option>
                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="font-mono text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "proyecto" : "proyectos"}
              {activeFilterCount > 0 && ` · ${activeFilterCount} filtro${activeFilterCount > 1 ? "s" : ""} activo${activeFilterCount > 1 ? "s" : ""}`}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={() => setFilters({ type: "all", status: "all", year: "all", location: "all" })}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={12} /> Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="aspect-[4/5] bg-muted animate-pulse" />)}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <p className="font-mono text-sm text-muted-foreground mb-2">Sin resultados</p>
              <p className="text-lg">No hay proyectos que coincidan con los filtros seleccionados.</p>
              <button
                onClick={() => setFilters({ type: "all", status: "all", year: "all", location: "all" })}
                className="mt-6 text-sm font-medium text-primary hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 text-sm font-medium border transition-all duration-200 ${
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-transparent text-foreground border-border hover:border-foreground"
      }`}
    >
      {label}
    </button>
  );
}