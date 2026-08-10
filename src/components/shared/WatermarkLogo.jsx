/**
 * Marca de agua vectorial de Constructora AvenZinc.
 * SVG nativo: nítido a cualquier escala, sin fondos artificiales,
 * visible sobre cualquier fotografía.
 */
export default function WatermarkLogo({ size = 64, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Círculo base carbón */}
      <circle cx="50" cy="50" r="48" fill="#1a1a1a" opacity="0.92" />
      {/* Anillo dorado */}
      <circle cx="50" cy="50" r="45" stroke="#F5B01D" strokeWidth="2.5" opacity="0.9" />
      <circle cx="50" cy="50" r="41" stroke="#F5B01D" strokeWidth="0.8" opacity="0.5" />

      {/* Letra A — estructura metálica */}
      <path
        d="M50 22 L66 74 L57 74 L53.5 62 L46.5 62 L43 74 L34 74 Z"
        fill="#F5B01D"
      />
      {/* Barra horizontal de la A */}
      <rect x="41" y="54" width="18" height="5" fill="#1a1a1a" />
      {/* Reflejo metálico superior */}
      <path
        d="M50 22 L54 33 L50 33 L46 33 Z"
        fill="#ffffff"
        opacity="0.35"
      />
    </svg>
  );
}