import { Link } from "react-router-dom";
import PosterVisual from "./PosterVisual";

const TYPE_LABELS = { movie: "فيلم", series: "مسلسل", book: "أدب", uploaded: "مرفوع" };

const TRAIT_TAGLINE = {
  extraversion: "بطولة مطلقة",
  neuroticism: "صراع داخلي",
  agreeableness: "قلب العائلة",
  conscientiousness: "عقل مدبّر",
  openness: "خارج المألوف",
};

export default function CharacterCard({ character, span = "", featured = false }) {
  const trait = character.signature_trait;

  return (
    <Link
      to={`/characters/${character.id}`}
      className={`group relative block overflow-hidden rounded-sm aspect-[2/3] border-2 border-transparent hover:border-mustard transition-colors duration-300 ${span}`}
    >
      <PosterVisual
        id={character.id}
        scores={character.scores}
        signatureTraits={character.signature_traits}
        coverUrl={character.cover_url}
        className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-1"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-void from-10% via-void/10 via-40% to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-transparent" />

      <div className="absolute top-3 inset-x-3 flex items-center justify-between">
        <span className="text-[9px] tracking-[0.2em] uppercase bg-void/80 text-mustard px-2 py-1 rounded-sm border border-mustard/30">
          {TYPE_LABELS[character.type] || character.type}
        </span>
        <span className="text-[9px] tracking-[0.15em] uppercase bg-mustard text-void px-2 py-1 rounded-sm font-bold rotate-2">
          {TRAIT_TAGLINE[trait]}
        </span>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-4">
        <div className="inline-block bg-void/80 px-1.5 mb-1.5">
          <span className="text-[10px] text-mustard tracking-[0.15em] uppercase font-quote">
            {character.work}
          </span>
        </div>
        <div
          className={`font-poster text-paper leading-[0.95] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] ${
            featured ? "text-4xl md:text-5xl" : "text-2xl"
          }`}
        >
          {character.name_ar}
        </div>
      </div>
    </Link>
  );
}
