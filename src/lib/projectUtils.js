export const PROJECT_TYPE_LABELS = {
  residential: "Residencial",
  commercial: "Comercial",
  infrastructure: "Infraestructura",
  urbanization: "Urbanización",
  remodeling: "Remodelación",
  civil_works: "Obras Civiles",
  maintenance: "Mantenimiento",
  industrial: "Industrial",
};

export const PROJECT_STATUS_LABELS = {
  completed: "Finalizado",
  in_progress: "En Ejecución",
};

export const STAGE_LABELS = {
  terrain: "Terreno",
  preparation: "Preparación",
  foundations: "Fundaciones",
  structure: "Estructura",
  installations: "Instalaciones",
  finishes: "Terminaciones",
  completed: "Obra Terminada",
};

export const DEFAULT_STAGES = [
  { title: "Terreno", order: 1 },
  { title: "Preparación", order: 2 },
  { title: "Fundaciones", order: 3 },
  { title: "Estructura", order: 4 },
  { title: "Instalaciones", order: 5 },
  { title: "Terminaciones", order: 6 },
  { title: "Obra Terminada", order: 7 },
];

export function formatSurface(m2) {
  if (!m2) return "—";
  return new Intl.NumberFormat("es-CL").format(m2) + " m²";
}

export function getProjectTypeLabel(type) {
  return PROJECT_TYPE_LABELS[type] || type;
}

export function getProjectStatusLabel(status) {
  return PROJECT_STATUS_LABELS[status] || status;
}