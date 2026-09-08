import CharacterPosterArt, { traitColors } from "./CharacterPosterArt";

function fallbackTraits(scores) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([trait]) => trait);
}

// لو عندنا غلاف كتاب/بوستر فيلم حقيقي (TMDB أو Open Library) نعرضه بمعالجة
// دوتون تناسب هوية الموقع البصرية، غير كذا نستخدم البوستر آرت المولّد.
// signatureTraits تجي جاهزة من الباك اند (محسوبة نسبةً لبقية المكتبة) عشان
// الألوان تتنوع فعلياً؛ لو ما توفرت (شخصية مرفوعة حديثاً) نحسبها من الدرجات الخام.
export default function PosterVisual({ id, scores, signatureTraits, coverUrl, className = "" }) {
  const traits = signatureTraits || fallbackTraits(scores);

  if (!coverUrl) {
    return <CharacterPosterArt id={id} signatureTraits={traits} className={className} />;
  }

  const [colorA, colorB] = traitColors(traits);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={coverUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 mix-blend-color-dodge opacity-25"
        style={{ background: `linear-gradient(135deg, ${colorA}, ${colorB})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
      <div className="absolute inset-0 halftone opacity-20" />
    </div>
  );
}
