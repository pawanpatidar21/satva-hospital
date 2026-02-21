import React, { useState } from 'react';
import { FaFire, FaRulerVertical, FaWeight, FaBirthdayCake } from 'react-icons/fa';

// Mifflin-St Jeor: BMR (men) = 10×weight + 6.25×height - 5×age + 5; (women) = 10×weight + 6.25×height - 5×age - 161
const ACTIVITY = [
  { value: 1.2, label: 'Sedentary (little/no exercise)' },
  { value: 1.375, label: 'Light (1–3 days/week)' },
  { value: 1.55, label: 'Moderate (3–5 days/week)' },
  { value: 1.725, label: 'Active (6–7 days/week)' },
  { value: 1.9, label: 'Very active (2x/day or physical job)' },
];

const calcBMR = (weight, height, age, gender) => {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
};

export default function CalorieBMRCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState(1.375);
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e?.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    if (!w || !h || !a || w <= 0 || h <= 0 || a <= 0) {
      setResult(null);
      return;
    }
    const bmr = Math.round(calcBMR(w, h, a, gender));
    const tdee = Math.round(bmr * activity);
    setResult({ bmr, tdee });
  };

  const reset = () => {
    setWeight('');
    setHeight('');
    setAge('');
    setResult(null);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-200/50 overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 sm:p-3 bg-amber-100 rounded-xl">
          <FaFire className="text-amber-600 text-xl sm:text-2xl" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Calorie / BMR</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">Mifflin-St Jeor equation. BMR = basal metabolic rate, TDEE = total daily energy.</p>
      <form onSubmit={calculate} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2"><FaWeight className="inline mr-2 text-amber-500" />Weight (kg)</label>
          <input type="number" min="20" max="500" step="0.1" placeholder="e.g. 65" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2"><FaRulerVertical className="inline mr-2 text-amber-500" />Height (cm)</label>
          <input type="number" min="100" max="250" step="0.1" placeholder="e.g. 170" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2"><FaBirthdayCake className="inline mr-2 text-amber-500" />Age (years)</label>
          <input type="number" min="10" max="120" placeholder="e.g. 35" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Activity level</label>
          <select value={activity} onChange={(e) => setActivity(parseFloat(e.target.value))} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none">
            {ACTIVITY.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors">Calculate</button>
          <button type="button" onClick={reset} className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors">Reset</button>
        </div>
      </form>
      {result && (
        <div className="mt-6 p-4 rounded-xl border-2 border-amber-200 bg-amber-50">
          <p className="text-sm font-semibold text-gray-700 mb-1">BMR</p>
          <p className="text-xl font-bold text-amber-600">{result.bmr} kcal/day</p>
          <p className="text-sm font-semibold text-gray-700 mt-2 mb-1">TDEE (Daily calories)</p>
          <p className="text-xl font-bold text-amber-600">{result.tdee} kcal/day</p>
          <p className="text-xs text-gray-500 mt-2">For reference only. Consult a nutritionist or doctor.</p>
        </div>
      )}
    </div>
  );
}
