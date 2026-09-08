"""يحمّل الموديل المدرّب (TF-IDF + 5 نماذج) مرة وحدة عند بدء السيرفر، ويوفّر
دالة predict(text) تحسب درجات Big Five من أي نص حوار."""

import pathlib

import joblib

ARTIFACTS_DIR = pathlib.Path(__file__).parent.parent.parent / "ml" / "artifacts"

TRAITS = ["extraversion", "neuroticism", "agreeableness", "conscientiousness", "openness"]

_vectorizer = joblib.load(ARTIFACTS_DIR / "tfidf_vectorizer.pkl")
_models = {trait: joblib.load(ARTIFACTS_DIR / f"model_{trait}.pkl") for trait in TRAITS}


def predict(text: str) -> dict[str, float]:
    X = _vectorizer.transform([text])
    return {trait: round(float(_models[trait].predict_proba(X)[0][1]), 3) for trait in TRAITS}
