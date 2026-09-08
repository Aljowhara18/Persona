"""
يدرّب 5 نماذج Logistic Regression صغيرة (واحد لكل بُعد من Big Five) على
Essays dataset (Pennebaker & King)، ويحفظ الـ vectorizer + النماذج في artifacts/.
يشتغل مرة وحدة أوفلاين — مو وقت تشغيل السيرفر.
"""

import pathlib

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

BASE_DIR = pathlib.Path(__file__).parent
DATASET_PATH = BASE_DIR / "datasets" / "essays.csv"
ARTIFACTS_DIR = BASE_DIR / "artifacts"

TRAITS = {
    "cEXT": "extraversion",
    "cNEU": "neuroticism",
    "cAGR": "agreeableness",
    "cCON": "conscientiousness",
    "cOPN": "openness",
}


def load_dataset() -> pd.DataFrame:
    df = pd.read_csv(DATASET_PATH, encoding="latin-1")
    for col in TRAITS:
        df[col] = (df[col].str.strip().str.lower() == "y").astype(int)
    return df


def main() -> None:
    ARTIFACTS_DIR.mkdir(exist_ok=True)
    df = load_dataset()

    X_train, X_test, y_train_df, y_test_df = train_test_split(
        df["TEXT"], df[list(TRAITS)], test_size=0.2, random_state=42
    )

    vectorizer = TfidfVectorizer(
        max_features=5000, stop_words="english", ngram_range=(1, 2)
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    joblib.dump(vectorizer, ARTIFACTS_DIR / "tfidf_vectorizer.pkl")

    print(f"{'trait':<20} {'test accuracy':>15}")
    for col, trait_name in TRAITS.items():
        model = LogisticRegression(max_iter=1000, C=1.0, solver="liblinear")
        model.fit(X_train_vec, y_train_df[col])

        preds = model.predict(X_test_vec)
        acc = accuracy_score(y_test_df[col], preds)
        print(f"{trait_name:<20} {acc:>15.3f}")

        joblib.dump(model, ARTIFACTS_DIR / f"model_{trait_name}.pkl")

    print(f"\nArtifacts saved to {ARTIFACTS_DIR}")


if __name__ == "__main__":
    main()
