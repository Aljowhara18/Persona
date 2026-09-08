import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizQuestions, submitQuiz } from "../api/client";

const SCALE = [
  { value: 1, label: "لا أتفق أبداً" },
  { value: 2, label: "لا أتفق" },
  { value: 3, label: "محايد" },
  { value: 4, label: "أتفق" },
  { value: 5, label: "أتفق تماماً" },
];

export default function Quiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getQuizQuestions().then(setQuestions).catch((e) => setError(e.message));
  }, []);

  async function handleAnswer(value) {
    const question = questions[step];
    const nextAnswers = [...answers, { question_id: question.id, value }];
    setAnswers(nextAnswers);

    if (step + 1 < questions.length) {
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitQuiz(nextAnswers);
      navigate("/result", { state: result });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (error) {
    return <p className="text-brick px-6 py-16 text-center">{error}</p>;
  }

  if (!questions.length || submitting) {
    return (
      <p className="text-paper/40 px-6 py-16 text-center">
        {submitting ? "نحسب أقرب شخصية لك..." : "جاري التحميل..."}
      </p>
    );
  }

  const question = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="px-6 md:px-12 py-16 max-w-xl mx-auto text-center min-h-[70vh]">
      <div className="h-1 bg-paper/10 rounded-full overflow-hidden mb-10">
        <div
          className="h-full bg-mustard transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-mustard tracking-[0.2em] uppercase mb-3">
        سؤال {step + 1} من {questions.length}
      </p>
      <h1 className="font-poster text-3xl md:text-4xl mb-10 leading-relaxed">
        {question.text_ar}
      </h1>

      <div className="flex flex-col gap-3">
        {SCALE.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            className="w-full py-3 rounded-sm border border-paper/20 text-sm hover:border-mustard hover:bg-mustard hover:text-void transition-colors"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
