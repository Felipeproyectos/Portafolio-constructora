import manifest from "./photo-manifest.json";

// Las fotos de obra se suben tal cual salen de la cámara del celular (varios
// MB cada una) vía el sync de Google Drive, sin pasar por ningún proceso de
// compresión de la plataforma. scripts/compress_photos.py genera copias
// livianas en /public/photos y este manifest mapea el nombre de archivo
// original a esa copia. Si una foto no está en el manifest (subida después
// de generarlo), se sirve el original tal cual — nunca rompe.
export function resolvePhotoUrl(src) {
  if (!src) return src;
  const filename = src.split("/").pop();
  return manifest[filename] || src;
}
