import { useEffect, useRef, useState } from "react";
import { getCharacters, uploadScript } from "../api/client";
import CharacterCard from "../components/CharacterCard";
import PosterVisual from "../components/PosterVisual";
import TraitRadarChart from "../components/TraitRadarChart";

const TABS = [
  { key: "all", label: "الكل" },
  { key: "movie", label: "أفلام" },
  { key: "series", label: "مسلسلات" },
  { key: "book", label: "أدب" },
];

const SPAN_PATTERN = ["", "", "md:col-span-2", "", "", "", "md:col-span-2", "", "", ""];

export default function Library() {
  const [characters, setCharacters] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploaded, setUploaded] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    getCharacters(activeTab === "all" ? undefined : activeTab)
      .then(setCharacters)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [activeTab]);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const result = await uploadScript(file);
      setUploaded(result.characters);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      {/* هيرو سينمائي */}
      <section className="relative border-b border-paper/10 overflow-hidden h-[52vh] min-h-[420px]">
        {characters[0] && (
          <PosterVisual
            id={characters[0].id}
            scores={characters[0].scores}
            signatureTraits={characters[0].signature_traits}
            coverUrl={characters[0].cover_url}
            className="absolute inset-0 w-full h-full opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-l from-void via-void/85 to-void/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/40" />
        <div className="relative h-full flex flex-col justify-end px-6 md:px-12 pb-14 max-w-4xl">
          <p className="text-mustard text-xs tracking-[0.3em] uppercase mb-4">
            SELECT ARCHIVE PRESENTS
          </p>
          <h1 className="font-poster text-5xl md:text-7xl leading-[1.05] mb-6 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
            كل شخصية
            <br />
            <span className="text-mustard">لها ملف نفسي.</span>
          </h1>
          <p className="text-paper/70 max-w-xl leading-7">
            أرشيف تحليل نفسي لأبطال السينما والأدب — من دافعهم الحقيقي إلى
            صدماتهم المؤسسة. تصفّحي الملفات، أو خذي الاختبار لتكتشفي أي
            شخصية تشبهك.
          </p>
        </div>
      </section>

      <div className="px-6 md:px-12 py-10 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-sm text-sm transition-colors ${
                  activeTab === tab.key
                    ? "bg-mustard text-void font-bold"
                    : "border border-paper/20 text-paper/60 hover:border-mustard hover:text-mustard"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 rounded-sm border border-paper/25 text-sm hover:border-mustard hover:text-mustard transition-colors disabled:opacity-50"
            >
              {uploading ? "جاري التحليل..." : "ارفعي سكربت خاص بك"}
            </button>
            <input
              type="file"
              accept=".txt"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {error && <p className="text-brick text-sm mb-6">{error}</p>}

        {uploaded && (
          <section className="mb-14">
            <h2 className="font-poster text-3xl mb-1">شخصيات من ملفك</h2>
            <p className="text-xs text-paper/40 mb-5">
              محسوبة الآن مباشرة (استدلال حي) — مو محفوظة بالأرشيف الدائم
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {uploaded.map((char) => (
                <div key={char.id} className="rounded-sm border border-paper/15 p-5 bg-panel">
                  <div className="font-poster text-xl mb-1">{char.name_ar}</div>
                  <div className="text-xs text-paper/40 mb-3 font-quote">{char.work}</div>
                  <TraitRadarChart
                    series={[{ name: char.name_ar, color: "#e0a72e", scores: char.scores }]}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <h2 className="font-poster text-3xl mb-6">الأرشيف الكامل</h2>

        {loading ? (
          <p className="text-paper/40">جاري التحميل...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {characters.map((char) => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
