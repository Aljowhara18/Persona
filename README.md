# PERSONA/ARCHIVE

**Cinematic Archive for Narrative Psychological Analysis**

A cinematic archive for narrative psychological analysis of characters from films, TV series, and literature, built around the Big Five personality framework, with a quiz that matches you to the closest character based on actual trait similarity.

## Structure

- `backend/` — Python + FastAPI. The model (TF-IDF + 5 Logistic Regression models) is trained on the Essays dataset (Pennebaker & King).
- `frontend/` — React + Vite + Tailwind, featuring a dark cinematic design with generated poster art and real movie/book covers whenever available.

## Running the Project

```bash
# Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Frontend (in a second terminal)
cd frontend
npm run dev
```

Open http://localhost:5173 to access the website, or http://localhost:8000/docs to test the API directly.

## Retraining the Model or Updating the Character Library

```bash
cd backend

# Retrains the model from scratch
venv/bin/python ml/train.py

# Recalculates character scores from characters_source.json
venv/bin/python ml/build_character_library.py
```

## Real Movie/TV Posters — TMDB

TMDB poster integration is enabled. The TMDB API key is stored in `backend/.env` and is not committed to Git.

Movie and TV characters automatically receive their official posters from TMDB, with a duotone color treatment applied to match the visual identity of the website. Literary characters use real book covers through Open Library. If a poster cannot be found for a specific work, the system automatically falls back to generated poster art.

To rebuild the library later, for example after adding new characters:

```bash
cd backend
export $(grep -v '^#' .env | xargs)
venv/bin/python ml/build_character_library.py
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/characters` | Returns a list of all characters. Optional filtering: `?type=movie\|series\|book` |
| GET | `/characters/{id}` | Returns a complete character profile, including narrative psychological analysis, Big Five traits, quotes, and poster |
| GET | `/characters/{id}/comments` | Returns user interpretations/comments for a character |
| POST | `/characters/{id}/comments` | Adds a new user interpretation |
| GET | `/quiz/questions` | Returns the 10 quiz questions |
| POST | `/quiz/submit` | Accepts quiz answers and returns the top 3 closest characters, match percentages, and an explanation |
| POST | `/scripts/upload` | Uploads a text script in `NAME: dialogue` format and analyzes its characters using live inference |

## Model Accuracy

The model is trained on long-form essays rather than movie dialogue, so its performance on the test data is approximately 55–61% per trait dimension. This is expected and is consistent with similar research.

Therefore, the narrative psychological analysis — including the character's origins, traits, and overall psychological interpretation — is the primary content of each profile. The numerical Big Five scores and radar charts are intended as supporting data, rather than definitive psychological assessments.
