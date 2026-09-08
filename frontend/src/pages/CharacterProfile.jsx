import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCharacter, getComments, addComment } from "../api/client";
import TraitRadarChart from "../components/TraitRadarChart";
import PosterVisual from "../components/PosterVisual";

const TRAIT_LABELS = {
  extraversion: "الانبساطية",
  neuroticism: "العصابية",
  agreeableness: "الطيبة والتعاون",
  conscientiousness: "الضمير الحي",
  openness: "الانفتاح على التجارب",
};

export default function CharacterProfile() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ author: "", text: "" });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    setCharacter(null);
    getCharacter(id).then(setCharacter).catch((e) => setError(e.message));
    getComments(id).then(setComments).catch(() => {});
  }, [id]);

  async function handleSubmitComment(e) {
    e.preventDefault();
    if (form.text.trim().length < 3) return;
    setPosting(true);
    try {
      const saved = await addComment(id, form);
      setComments([saved, ...comments]);
      setForm({ author: "", text: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  if (error) {
    return (
      <div className="px-6 md:px-12 py-16 max-w-3xl mx-auto text-center">
        <p className="text-brick">{error}</p>
        <Link to="/" className="text-paper/50 underline text-sm mt-4 inline-block">
          رجوع للأرشيف
        </Link>
      </div>
    );
  }

  if (!character) {
    return <p className="text-paper/40 px-6 md:px-12 py-16">جاري التحميل...</p>;
  }

  const { psychology } = character;

  return (
    <div>
      {/* هيرو البوستر */}
      <section className="relative h-[46vh] min-h-[320px] overflow-hidden border-b border-paper/10">
        <PosterVisual
          id={character.id}
          scores={character.scores}
          signatureTraits={character.signature_traits}
          coverUrl={character.cover_url}
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/20" />
        <div className="relative h-full flex flex-col justify-end px-6 md:px-12 pb-8 max-w-4xl">
          <Link to="/" className="text-sm text-paper/60 hover:text-mustard mb-4 w-fit">
            ← رجوع للأرشيف
          </Link>
          <span className="text-mustard text-xs tracking-[0.3em] uppercase mb-2">
            {character.work}
          </span>
          <h1 className="font-poster text-5xl md:text-7xl leading-none drop-shadow-lg">
            {character.name_ar}
          </h1>
          <p className="text-paper/50 font-quote mt-2">{character.name_en}</p>
        </div>
      </section>

      <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto">
        {/* التشريح النفسي السردي */}
        <section className="mb-14">
          <h2 className="font-poster text-2xl text-mustard mb-3">الأصل والصدمة المؤسسة</h2>
          <p className="text-paper/85 leading-8">{psychology.origin}</p>
        </section>

        <section className="mb-14">
          <h2 className="font-poster text-2xl text-mustard mb-5">سمات نفسية بارزة</h2>
          <ul className="space-y-4">
            {psychology.traits.map((trait, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-poster text-3xl text-paper/20 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-paper/85 leading-7 pt-1">{trait}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16 border-r-4 border-mustard pr-6 py-2 bg-panel/60">
          <h2 className="font-poster text-xl text-mustard mb-2">الخلاصة</h2>
          <p className="text-paper/90 leading-8 italic">{psychology.conclusion}</p>
        </section>

        {/* البيانات الكمية الداعمة */}
        <section className="mb-16">
          <h2 className="font-poster text-2xl mb-1">القياس الكمي (Big Five)</h2>
          <p className="text-xs text-paper/40 mb-6">
            درجات مستخرجة بموديل NLP مدرّب من حوار الشخصية — بيانات داعمة للتحليل السردي أعلاه، مو بديل عنه
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="bg-panel rounded-sm p-6">
              <TraitRadarChart
                series={[{ name: character.name_ar, color: "#e0a72e", scores: character.scores }]}
              />
            </div>
            <div className="space-y-3">
              {Object.entries(character.scores).map(([trait, value]) => (
                <div key={trait}>
                  <div className="flex justify-between text-xs text-paper/50 mb-1">
                    <span>{TRAIT_LABELS[trait]}</span>
                    <span>{Math.round(value * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-paper/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-mustard rounded-full"
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* اقتباسات */}
        <section className="mb-16">
          <h2 className="font-poster text-2xl mb-5">اقتباسات</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {character.quotes.map((quote, i) => (
              <li
                key={i}
                className="font-quote italic text-paper/70 border border-paper/10 bg-panel rounded-sm p-4"
              >
                “{quote}”
              </li>
            ))}
          </ul>
        </section>

        {/* تفسيرات المستخدمين */}
        <section>
          <h2 className="font-poster text-2xl mb-1">تفسيرك النفسي الخاص</h2>
          <p className="text-xs text-paper/40 mb-5">
            شاركي كيف تحللين هذه الشخصية — نقرأ الشخصيات كل واحد بزاويته
          </p>

          <form onSubmit={handleSubmitComment} className="mb-8 space-y-3">
            <input
              type="text"
              placeholder="اسمك (اختياري)"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full bg-panel border border-paper/15 rounded-sm px-4 py-2.5 text-sm placeholder:text-paper/30 focus:outline-none focus:border-mustard"
            />
            <textarea
              placeholder="وش تفسيرك النفسي لهذي الشخصية؟"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              rows={3}
              className="w-full bg-panel border border-paper/15 rounded-sm px-4 py-2.5 text-sm placeholder:text-paper/30 focus:outline-none focus:border-mustard resize-none"
            />
            <button
              type="submit"
              disabled={posting}
              className="px-5 py-2.5 rounded-sm bg-mustard text-void text-sm font-bold hover:bg-paper transition-colors disabled:opacity-50"
            >
              {posting ? "جاري النشر..." : "شاركي تفسيرك"}
            </button>
          </form>

          <div className="space-y-4">
            {comments.length === 0 && (
              <p className="text-paper/30 text-sm">كوني أول من يشارك تفسيره.</p>
            )}
            {comments.map((c) => (
              <div key={c.id} className="border-t border-paper/10 pt-4">
                <div className="text-sm text-mustard font-bold mb-1">{c.author}</div>
                <p className="text-paper/75 leading-7 text-sm">{c.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
