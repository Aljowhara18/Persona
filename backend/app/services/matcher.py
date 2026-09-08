"""يقارن متجه شخص (من الكويز أو من نص) بكل شخصيات المكتبة عبر تشابه جيب التمام
(cosine similarity)، ويبني تفسير مبني على أقرب بُعدين متطابقين + اقتباس داعم."""

import math

TRAITS = ["extraversion", "neuroticism", "agreeableness", "conscientiousness", "openness"]

TRAIT_LABELS_AR = {
    "extraversion": "الانبساطية",
    "neuroticism": "العصابية/التوتر",
    "agreeableness": "الطيبة والتعاون",
    "conscientiousness": "الضمير الحي",
    "openness": "الانفتاح على التجارب",
}


def _vector(scores: dict) -> list[float]:
    return [scores[t] for t in TRAITS]


def cosine_similarity(a: dict, b: dict) -> float:
    va, vb = _vector(a), _vector(b)
    dot = sum(x * y for x, y in zip(va, vb))
    norm_a = math.sqrt(sum(x * x for x in va))
    norm_b = math.sqrt(sum(y * y for y in vb))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def top_aligned_traits(user_scores: dict, character_scores: dict, top_n: int = 2) -> list[str]:
    diffs = {t: abs(user_scores[t] - character_scores[t]) for t in TRAITS}
    return sorted(diffs, key=diffs.get)[:top_n]


def build_explanation(user_scores: dict, character: dict) -> str:
    aligned = top_aligned_traits(user_scores, character["scores"])
    labels = "، ".join(TRAIT_LABELS_AR[t] for t in aligned)
    quote = character["quotes"][0] if character["quotes"] else ""
    return (
        f"تطابقتوا بشكل خاص في {labels}. "
        f'مثل قول {character["name_ar"]}: "{quote}"'
    )


def find_matches(user_scores: dict, characters: list[dict], top_n: int = 3) -> list[dict]:
    scored = [
        {
            "character": char,
            "similarity": round(cosine_similarity(user_scores, char["scores"]), 3),
            "explanation": build_explanation(user_scores, char),
        }
        for char in characters
    ]
    scored.sort(key=lambda item: item["similarity"], reverse=True)
    return scored[:top_n]
