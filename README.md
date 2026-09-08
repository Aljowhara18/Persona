# PERSONA/ARCHIVE

أرشيف سينمائي لتحليل نفسي سردي للشخصيات (أفلام / مسلسلات / أدب) مبني على إطار Big Five، مع كويز يطابقك مع أقرب شخصية بناءً على تشابه فعلي في السمات.

## البنية

- `backend/` — Python + FastAPI. الموديل (TF-IDF + 5 نماذج Logistic Regression) مدرّب على Essays dataset (Pennebaker & King).
- `frontend/` — React + Vite + Tailwind، تصميم سينمائي داكن (بوستر آرت مولّد + أغلفة/بوسترات حقيقية عند توفرها).

## تشغيل المشروع

```bash
# الباك اند
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# الفرونت اند (بترمينال ثاني)
cd frontend
npm run dev
```

افتحي `http://localhost:5173` للموقع، و`http://localhost:8000/docs` لتجربة الـ API مباشرة.

### إعادة تدريب الموديل أو تحديث مكتبة الشخصيات

```bash
cd backend
venv/bin/python ml/train.py                     # يدرّب الموديل من جديد
venv/bin/python ml/build_character_library.py    # يعيد حساب درجات الشخصيات من characters_source.json
```

### بوسترات الأفلام/المسلسلات الحقيقية (TMDB) — مفعّلة

مفتاح TMDB محفوظ بـ `backend/.env` (غير مرفوع لـ git). كل شخصية أفلام/مسلسلات تاخذ بوسترها الرسمي تلقائياً (معالجة لونية دوتون تناسب هوية الموقع)، والأدب يستخدم أغلفة كتب حقيقية عبر Open Library. لو ما لقى بوستر لعمل معيّن يرجع للبوستر آرت المولّد تلقائياً.

لإعادة بناء المكتبة لاحقاً (بعد إضافة شخصيات جديدة مثلاً):

```bash
cd backend
export $(grep -v '^#' .env | xargs)
venv/bin/python ml/build_character_library.py
```

## Endpoints

| Method | Path | الوصف |
|---|---|---|
| GET | `/characters` | قائمة كل الشخصيات (فلترة اختيارية: `?type=movie\|series\|book`) |
| GET | `/characters/{id}` | بروفايل شخصية واحدة كامل (تشريح نفسي سردي + Big Five + اقتباسات + بوستر) |
| GET | `/characters/{id}/comments` | تفسيرات المستخدمين لهذي الشخصية |
| POST | `/characters/{id}/comments` | إضافة تفسير جديد |
| GET | `/quiz/questions` | أسئلة الكويز (10 أسئلة) |
| POST | `/quiz/submit` | يستقبل الإجابات، يرجع أقرب 3 شخصيات + نسبة تطابق + تفسير |
| POST | `/scripts/upload` | يرفع ملف نصي بصيغة `NAME: dialogue` ويحلل شخصياته (استدلال حي) |

## ملاحظة حول دقة الموديل

الموديل مدرّب على مقالات طويلة (essays) وليس حوار أفلام، فدقته على بيانات الاختبار حوالي 55-61% لكل بُعد (وهذا متوقع وموثق بأبحاث مشابهة). لهذا التشريح النفسي السردي (الأصل، السمات، الخلاصة) بكل بروفايل هو المحتوى الأساسي المعتمد عليه، والأرقام/الرادار بيانات داعمة فقط.
