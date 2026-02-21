import React, { useState } from 'react';
import { FaWeight, FaTint } from 'react-icons/fa';

// Base: ~35 ml/kg for sedentary, ~40 light, ~45 moderate, ~50 very active
const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary (little/no exercise)', mlPerKg: 35 },
  { value: 'light', label: 'Light (1–3 days/week)', mlPerKg: 40 },
  { value: 'moderate', label: 'Moderate (3–5 days/week)', mlPerKg: 45 },
  { value: 'active', label: 'Active (6–7 days/week)', mlPerKg: 50 },
];

const calculateWater = (weightKg, activityKey) => {
  if (!weightKg || weightKg <= 0) return null;
  const level = ACTIVITY_LEVELS.find((l) => l.value === activityKey) || ACTIVITY_LEVELS[0];
  const ml = weightKg * level.mlPerKg;
  const liters = (ml / 1000).toFixed(1);
  const glasses = Math.round(ml / 250); // ~250 ml per glass
  return { liters, glasses };
};

export default function WaterIntakeCalculator() {
  const [weightKg, setWeightKg] = useState('');
  const [activity, setActivity] = useState('sedentary');
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e?.preventDefault();
    const w = parseFloat(weightKg);
    if (!w || w <= 0) {
      setResult(null);
      return;
    }
    setResult(calculateWater(w, activity));
  };

  const reset = () => {
    setWeightKg('');
    setResult(null);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-green-200/50 overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 sm:p-3 bg-green-100 rounded-xl">
          <FaTint className="text-green-600 text-xl sm:text-2xl" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Water Intake</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">Enter weight and activity level for daily water intake.</p>
      <form onSubmit={calculate} className="space-y-4">
        <div>
          <label htmlFor="weight-water" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaWeight className="text-green-500" /> Weight (kg)
          </label>
          <input
            id="weight-water"
            type="number"
            min="20"
            max="500"
            step="0.1"
            placeholder="e.g. 65"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
          />
        </div>
        <div>
          <label htmlFor="activity-water" className="block text-sm font-semibold text-gray-700 mb-2">Activity Level</label>
          <select
            id="activity-water"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
          >
            {ACTIVITY_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors">
            Calculate
          </button>
          <button type="button" onClick={reset} className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors">
            Reset
          </button>
        </div>
      </form>
      {result && (
        <div className="mt-6 p-4 rounded-xl border-2 border-green-200 bg-green-50">
          <p className="text-sm font-semibold text-gray-700 mb-1">Daily Water Intake</p>
          <p className="text-2xl font-bold text-green-600">{result.liters} L</p>
          <p className="text-sm text-gray-600 mt-1">~{result.glasses} glasses (250 ml each)</p>
          <p className="text-xs text-gray-500 mt-2">For reference only. Needs may vary with climate and health.</p>
        </div>
      )}
    </div>
  );
}
