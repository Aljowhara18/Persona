import { useLocation, Link } from "react-router-dom";
import TraitRadarChart from "../components/TraitRadarChart";
import PosterVisual from "../components/PosterVisual";

export default function Result() {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-paper/60 mb-4">ما فيه نتيجة بعد.</p>
        <Link to="/quiz" className="text-mustard underline">
          خذي الكويز أول
        </Link>
      </div>
    );
  }

  const { user_scores: userScores, matches } = state;
  const [top, ...rest] = matches;

  return (
    <div>
      <section className="relative h-[42vh] min-h-[300px] overflow-hidden border-b border-paper/10">
        <PosterVisual
          id={top.character.id}
          scores={top.character.scores}
          signatureTraits={top.character.signature_traits}
          coverUrl={top.character.cover_url}
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/30" />
        <div className="relative h-full flex flex-col items-center justify-end text-center pb-10 px-6">
          <p className="text-mustard text-xs tracking-[0.3em] uppercase mb-3">
            أقرب شخصية لك
          </p>
          <h1 className="font-poster text-5xl md:text-7xl leading-none drop-shadow-lg">
            {top.character.name_ar}
          </h1>
          <p className="text-paper/50 font-quote mt-2">{top.character.name_en}</p>
          <p className="text-sm text-paper/70 mt-3">
            نسبة تطابق <span className="text-mustard font-bold">{Math.round(top.similarity * 100)}%</span>
          </p>
        </div>
      </section>

      <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-14">
          <div className="bg-panel rounded-sm p-6">
            <TraitRadarChart
              series={[
                { name: "أنتِ", color: "#c23c2e", scores: userScores },
                { name: top.character.name_ar, color: "#e0a72e", scores: top.character.scores },
              ]}
            />
          </div>
          <div>
            <h2 className="font-poster text-2xl text-mustard mb-3">ليش هذا التطابق؟</h2>
            <p className="text-paper/85 leading-8">{top.explanation}</p>
            <Link
              to={`/characters/${top.character.id}`}
              className="inline-block mt-5 text-sm text-mustard underline"
            >
              اقرئي التحليل النفسي الكامل ←
            </Link>
          </div>
        </div>

        {rest.length > 0 && (
          <>
            <h2 className="font-poster text-2xl mb-5">شخصيات قريبة منك كذلك</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
              {rest.map((match) => (
                <Link
                  to={`/characters/${match.character.id}`}
                  key={match.character.id}
                  className="rounded-sm border border-paper/15 p-5 bg-panel hover:border-mustard transition-colors"
                >
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-poster text-xl">{match.character.name_ar}</span>
                    <span className="text-xs text-mustard font-bold">
                      {Math.round(match.similarity * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-paper/70 leading-6">{match.explanation}</p>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="text-center">
          <Link
            to="/quiz"
            className="inline-block px-6 py-2.5 rounded-sm border border-paper/25 text-sm hover:border-mustard hover:text-mustard transition-colors"
          >
            جربي مرة ثانية
          </Link>
        </div>
      </div>
    </div>
  );
}
