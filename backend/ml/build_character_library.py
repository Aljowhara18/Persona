"""
يقرأ characters_source.json (اقتباسات + جمل توصيفية لكل شخصية)، يمرر نص كل شخصية
على الموديل المدرّب (artifacts/) عشان يحسب متجه Big Five لها، ويكتب النتيجة إلى
app/data/characters.json — هذا هو ملف المكتبة اللي يقرأه الـ API وقت التشغيل.
يشتغل مرة وحدة أوفلاين (أو كل ما تغيّرت بيانات الشخصيات).
"""

import json
import os
import pathlib
import urllib.parse
import urllib.request
from typing import Optional

import joblib

BASE_DIR = pathlib.Path(__file__).parent
SOURCE_PATH = BASE_DIR / "characters_source.json"
ARTIFACTS_DIR = BASE_DIR / "artifacts"
OUTPUT_PATH = BASE_DIR.parent / "app" / "data" / "characters.json"

TMDB_API_KEY = os.environ.get("TMDB_API_KEY")
TMDB_MEDIA_TYPE = {"movie": "movie", "series": "tv"}

TRAITS = ["extraversion", "neuroticism", "agreeableness", "conscientiousness", "openness"]


def load_model():
    vectorizer = joblib.load(ARTIFACTS_DIR / "tfidf_vectorizer.pkl")
    models = {trait: joblib.load(ARTIFACTS_DIR / f"model_{trait}.pkl") for trait in TRAITS}
    return vectorizer, models


def score_text(text: str, vectorizer, models) -> dict:
    X = vectorizer.transform([text])
    return {trait: round(float(models[trait].predict_proba(X)[0][1]), 3) for trait in TRAITS}


def compute_signature_traits(library: list[dict]) -> None:
    """يحسب لكل شخصية أبرز سمة نسبةً لبقية المكتبة (z-score) بدل القيمة المطلقة،
    عشان ما تتكرر نفس السمة (مثل الانفتاح) كأبرز صفة لكل الشخصيات."""
    import statistics

    for trait in TRAITS:
        values = [c["scores"][trait] for c in library]
        mean = statistics.mean(values)
        stdev = statistics.pstdev(values) or 1e-9
        for c in library:
            c.setdefault("_z", {})[trait] = (c["scores"][trait] - mean) / stdev

    for c in library:
        ranked = sorted(c["_z"], key=c["_z"].get, reverse=True)
        c["signature_trait"] = ranked[0]
        c["signature_traits"] = ranked[:2]
        del c["_z"]


def fetch_book_cover_url(title: str) -> Optional[str]:
    """يبحث بعنوان الكتاب بمكتبة Open Library (بدون مفتاح API) ويرجع رابط الغلاف إن وُجد."""
    query = urllib.parse.urlencode({"title": title, "limit": 1})
    url = f"https://openlibrary.org/search.json?{query}"
    try:
        with urllib.request.urlopen(url, timeout=8) as resp:
            data = json.loads(resp.read())
        cover_id = data["docs"][0].get("cover_i")
        if cover_id:
            return f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
    except Exception as e:
        print(f"  cover lookup failed for {title!r}: {e}")
    return None


def fetch_tmdb_poster_url(title: str, char_type: str) -> Optional[str]:
    """يبحث بعنوان الفيلم/المسلسل بـ TMDB (يحتاج TMDB_API_KEY) ويرجع رابط البوستر الرسمي."""
    if not TMDB_API_KEY:
        return None
    media_type = TMDB_MEDIA_TYPE.get(char_type)
    if not media_type:
        return None

    query = urllib.parse.urlencode({"api_key": TMDB_API_KEY, "query": title})
    url = f"https://api.themoviedb.org/3/search/{media_type}?{query}"
    try:
        with urllib.request.urlopen(url, timeout=8) as resp:
            data = json.loads(resp.read())
        poster_path = data["results"][0].get("poster_path")
        if poster_path:
            return f"https://image.tmdb.org/t/p/w780{poster_path}"
    except Exception as e:
        print(f"  TMDB lookup failed for {title!r}: {e}")
    return None


def main() -> None:
    vectorizer, models = load_model()
    characters = json.loads(SOURCE_PATH.read_text(encoding="utf-8"))

    library = []
    for char in characters:
        full_text = " ".join(char["quotes"] + char.get("extra_lines", []))
        scores = score_text(full_text, vectorizer, models)

        cover_url = None
        if char["type"] == "book":
            cover_url = fetch_book_cover_url(char["work"])
        elif char["type"] in TMDB_MEDIA_TYPE:
            cover_url = fetch_tmdb_poster_url(char["work"], char["type"])
        print(f"  {char['name_en']}: cover {'found' if cover_url else 'not found'}")

        library.append(
            {
                "id": char["id"],
                "name_ar": char["name_ar"],
                "name_en": char["name_en"],
                "work": char["work"],
                "type": char["type"],
                "scores": scores,
                "quotes": char["quotes"],
                "psychology": char["psychology"],
                "cover_url": cover_url,
            }
        )

    compute_signature_traits(library)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(library, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"Wrote {len(library)} characters to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
