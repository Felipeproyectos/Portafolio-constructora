/**
 * Marca de agua de Constructora AvenZinc.
 * Logo oficial sobre fondo negro sólido — visible sobre cualquier fotografía.
 * El logo es vertical (retrato), se controla por ancho y la altura es automática.
 */
const LOGO_URL = "https://media.base44.com/images/public/6a7a0d673c6e832f34f21db3/ba9546240_ChatGPTImage10ago202616_01_24.png";

export default function WatermarkLogo({ width = 80, className = "", style }) {
  return (
    <img
      src={LOGO_URL}
      alt="Constructora AvenZinc"
      style={{ width: width, height: "auto" }}
      className={`object-contain ${className}`}
    />
  );
}