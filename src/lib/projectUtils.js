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

function originalFilename(url) {
  return (url || "").split("/").pop().replace(/^[a-f0-9]{6,}_/, "");
}

// El sync con Google Drive a veces re-sube la misma foto con otro hash de
// almacenamiento (mismo nombre de archivo original al final de la URL).
// Dedup por ese nombre para no repetir la misma imagen en la galería.
export function dedupePhotosByOriginalFilename(photos) {
  const seen = new Set();
  return photos.filter((p) => {
    const key = originalFilename(p.url);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Curatoría manual de la galería: qué fotos se muestran por defecto (ver
// scripts/compress_photos.py y la sesión de curación) contra el nombre de
// archivo original — no el id de ProjectPhoto, porque el dedup de arriba
// puede quedarse con cualquiera de las copias duplicadas del mismo archivo.
export function markCurated(photos) {
  return photos.map((p) => ({ ...p, curated: curatedFilenames.has(originalFilename(p.url)) }));
}

// Las descripciones se escriben como texto tipo WhatsApp: párrafos separados
// por líneas en blanco, con una lista "- Punto: detalle" en el medio. Esto
// separa esos bloques para poder renderizar la lista como tal en vez de un
// bloque de texto plano.
const BULLET_RE = /^[-–—•]\s+/;

export function parseDescription(text) {
  const blocks = (text || "").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const intro = [];
  const outro = [];
  const items = [];
  let listTitle = null;
  let seenList = false;

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const isListBlock = lines.some((l) => BULLET_RE.test(l));
    if (isListBlock) {
      seenList = true;
      for (const line of lines) {
        if (BULLET_RE.test(line)) {
          const rest = line.replace(BULLET_RE, "").trim();
          const colon = rest.indexOf(":");
          items.push(
            colon > -1 && colon < 60
              ? { label: rest.slice(0, colon).trim(), text: rest.slice(colon + 1).trim() }
              : { label: null, text: rest }
          );
        } else {
          listTitle = line.replace(/:$/, "").trim();
        }
      }
    } else if (!seenList) {
      intro.push(block);
    } else {
      outro.push(block);
    }
  }
  return { intro, listTitle, items, outro };
}