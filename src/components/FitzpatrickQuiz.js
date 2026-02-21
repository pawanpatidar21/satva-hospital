import React, { useState } from 'react';
import { FaSun } from 'react-icons/fa';

// Simplified Fitzpatrick quiz - 6 questions, each answer adds 0-2 points. Total 0-12 maps to type 1-6.
const QUESTIONS = [
  { id: 'sunburn', q: 'What happens when you spend 30 min in midday sun without sunscreen?', opts: [
    { label: 'Always burn, never tan', pts: 0 },
    { label: 'Burn easily, tan with difficulty', pts: 1 },
    { label: 'Burn moderately, tan gradually', pts: 2 },
    { label: 'Burn little, tan easily', pts: 3 },
    { label: 'Rarely burn, tan deeply', pts: 4 },
    { label: 'Never burn, always tan', pts: 5 },
  ]},
  { id: 'tan', q: 'After sun exposure, how does your skin react?', opts: [
    { label: 'Burns, peels, no tan', pts: 0 },
    { label: 'Burns, then light tan', pts: 1 },
    { label: 'Burns mildly, tans to light brown', pts: 2 },
    { label: 'Minimal burn, tans to moderate brown', pts: 3 },
    { label: 'No burn, tans to dark brown', pts: 4 },
    { label: 'No burn, tans to very dark', pts: 5 },
  ]},
  { id: 'hair', q: 'What is your natural hair color?', opts: [
    { label: 'Red or blonde', pts: 0 },
    { label: 'Blonde', pts: 1 },
    { label: 'Light brown', pts: 2 },
    { label: 'Dark brown', pts: 3 },
    { label: 'Black', pts: 4 },
  ]},
  { id: 'eyes', q: 'What is your eye color?', opts: [
    { label: 'Light blue, gray, green', pts: 0 },
    { label: 'Blue, gray, or green', pts: 1 },
    { label: 'Hazel or light brown', pts: 2 },
    { label: 'Dark brown', pts: 3 },
    { label: 'Brownish black', pts: 4 },
  ]},
  { id: 'skin', q: 'What is your natural skin color (unexposed)?', opts: [
    { label: 'Ivory white', pts: 0 },
    { label: 'Fair or pale', pts: 1 },
    { label: 'Beige or light brown', pts: 2 },
    { label: 'Olive or medium brown', pts: 3 },
    { label: 'Dark brown', pts: 4 },
    { label: 'Dark brown to black', pts: 5 },
  ]},
];

const TYPES = [
  { type: 1, name: 'Type I', desc: 'Very fair, always burns, never tans. Highest sun sensitivity.', color: 'text-rose-600', bg: 'bg-rose-100' },
  { type: 2, name: 'Type II', desc: 'Fair, burns easily, tans with difficulty.', color: 'text-orange-600', bg: 'bg-orange-100' },
  { type: 3, name: 'Type III', desc: 'Medium, burns moderately, tans gradually.', color: 'text-amber-600', bg: 'bg-amber-100' },
  { type: 4, name: 'Type IV', desc: 'Olive, burns minimally, tans easily.', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { type: 5, name: 'Type V', desc: 'Brown, rarely burns, tans deeply.', color: 'text-amber-700', bg: 'bg-amber-200' },
  { type: 6, name: 'Type VI', desc: 'Dark brown/black, never burns, always tans.', color: 'text-amber-800', bg: 'bg-amber-300' },
];

const scoreToType = (score) => Math.min(6, Math.max(1, 1 + Math.floor(score / 5)));

export default function FitzpatrickQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleAnswer = (qId, pts) => {
    const next = { ...answers, [qId]: pts };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else {
      const total = Object.values(next).reduce((a, b) => a + b, 0);
      const typeNum = scoreToType(total);
      setResult(TYPES[typeNum - 1]);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  const currentQ = QUESTIONS[step];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-secondary-200/50 overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 sm:p-3 bg-secondary-100 rounded-xl">
          <FaSun className="text-secondary-600 text-xl sm:text-2xl" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Fitzpatrick Skin Type</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">Answer a few questions to estimate your skin phototype (for sun sensitivity, laser suitability).</p>

      {!result ? (
        <>
          <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
            <span>Question {step + 1} of {QUESTIONS.length}</span>
          </div>
          <div className="space-y-3">
            <p className="font-semibold text-gray-800">{currentQ.q}</p>
            <div className="space-y-2">
              {currentQ.opts.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAnswer(currentQ.id, opt.pts)}
                  className="w-full text-left px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-secondary-400 hover:bg-secondary-50 transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700">
                Back
              </button>
            )}
            <button type="button" onClick={reset} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700">
              Restart
            </button>
          </div>
        </>
      ) : (
        <div className={`p-4 rounded-xl border-2 border-secondary-200 ${result.bg}`}>
          <p className="text-sm font-semibold text-gray-700 mb-1">Your skin type (estimated)</p>
          <p className={`text-2xl font-bold ${result.color}`}>{result.name}</p>
          <p className="text-sm text-gray-700 mt-2">{result.desc}</p>
          <p className="text-xs text-gray-500 mt-3">For reference only. Used for laser/sun protection planning. Consult a dermatologist.</p>
          <button type="button" onClick={reset} className="mt-4 px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white font-semibold rounded-xl">
            Take Again
          </button>
        </div>
      )}
    </div>
  );
}
