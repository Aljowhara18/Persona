// بوستر آرت تجريدي مولّد (مو صورة حقيقية — قضية حقوق نشر) لكل شخصية.
// ألوان صريحة مشتقة من أعلى سمتين نفسيتين + طبقات وخشونة تعطي طاقة بوستر سينمائي.

export const TRAIT_COLORS = {
  extraversion: "#ff6b35",
  neuroticism: "#e63946",
  agreeableness: "#ff8fa3",
  conscientiousness: "#2ec4b6",
  openness: "#9b5de5",
};

export const POP = "#ffd166";

export function traitColors(signatureTraits) {
  const [traitA, traitB] = signatureTraits || [];
  return [TRAIT_COLORS[traitA] || "#ff6b35", TRAIT_COLORS[traitB] || "#9b5de5"];
}

function hashSeed(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

export default function CharacterPosterArt({ id, signatureTraits, className = "" }) {
  const seed = hashSeed(id);
  const [colorA, colorB] = traitColors(signatureTraits);
  const gradId = `grad-${id}`;
  const glowId = `glow-${id}`;
  const grainId = `grain-${id}`;

  const rand = (n, mod, offset = 0) => (((seed * (n + 7)) % mod) + offset);
  const tilt = (rand(1, 10) - 5) * 1.2;
  const stripeAngle = rand(2, 40) - 20;

  const decorations = Array.from({ length: 7 }).map((_, i) => ({
    cx: 6 + rand(i * 3 + 1, 88),
    cy: 6 + rand(i * 5 + 2, 88),
    r: 0.8 + (rand(i * 2 + 3, 22) / 10),
    opacity: 0.35 + rand(i + 4, 45) / 100,
    isStar: rand(i + 9, 3) === 0,
  }));

  return (
    <svg
      viewBox="0 0 100 150"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colorA} />
          <stop offset="100%" stopColor={colorB} />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor={colorA} stopOpacity="0.9" />
          <stop offset="100%" stopColor={colorA} stopOpacity="0" />
        </radialGradient>
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <pattern id={`dots-${id}`} width="3.2" height="3.2" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.55" fill="#0c0b0a" opacity="0.35" />
        </pattern>
      </defs>

      {/* خلفية قاعدية بلونين متقاطعين بشكل مائل */}
      <rect width="100" height="150" fill="#0c0b0a" />
      <g transform={`rotate(${stripeAngle} 50 75)`}>
        <rect x="-30" y="55" width="160" height="70" fill={colorB} opacity="0.55" />
      </g>

      {/* هالة إشعاع قوية */}
      <rect width="100" height="150" fill={`url(#${glowId})`} />

      {/* جسم/كتفين */}
      <g transform={`rotate(${tilt} 50 120)`}>
        <path
          d="M 12 152 Q 12 92 50 88 Q 88 92 88 152 Z"
          fill={`url(#${gradId})`}
        />
      </g>

      {/* رأس */}
      <g transform={`rotate(${tilt} 50 60)`}>
        <ellipse cx="50" cy="60" rx="25" ry="28" fill={`url(#${gradId})`} />
      </g>

      {/* شريط لون منبثق (POP) كتوقيع بصري */}
      <rect x="0" y="0" width="100" height="6" fill={POP} opacity="0.9" />
      <rect x="0" y="144" width="100" height="6" fill={POP} opacity="0.9" />

      {/* خط فاصل داخلي يعطي إحساس نحت/بوستر */}
      <path d="M 50 34 L 50 152" stroke="#0c0b0a" strokeOpacity="0.3" strokeWidth="1.2" />

      {decorations.map((d, i) =>
        d.isStar ? (
          <path
            key={i}
            d={`M ${d.cx} ${d.cy - d.r * 2} L ${d.cx + d.r * 0.6} ${d.cy - d.r * 0.6} L ${d.cx + d.r * 2} ${d.cy} L ${d.cx + d.r * 0.6} ${d.cy + d.r * 0.6} L ${d.cx} ${d.cy + d.r * 2} L ${d.cx - d.r * 0.6} ${d.cy + d.r * 0.6} L ${d.cx - d.r * 2} ${d.cy} L ${d.cx - d.r * 0.6} ${d.cy - d.r * 0.6} Z`}
            fill={POP}
            opacity={d.opacity}
          />
        ) : (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#f5efe3" opacity={d.opacity} />
        )
      )}

      {/* حبيبات halftone */}
      <rect width="100" height="150" fill={`url(#dots-${id})`} opacity="0.55" />

      {/* خشونة/نويز فوق كل شي لإحساس بوستر مطبوع قديم */}
      <rect width="100" height="150" filter={`url(#${grainId})`} opacity="0.06" />
    </svg>
  );
}
