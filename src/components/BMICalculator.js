import React, { useState } from 'react';
import { FaCalculator, FaWeight, FaRulerVertical } from 'react-icons/fa';

const getBMICategory = (bmi) => {
  if (!bmi || bmi <= 0) return null;
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-300' };
  if (bmi < 25) return { label: 'Normal', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-300' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-300' };
  return { label: 'Obese', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-300' };
};

export default function BMICalculator() {
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState(null);

  const calculate = (e) => {
    e?.preventDefault();
    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);
    if (!h || !w || h <= 0 || w <= 0) {
      setBmi(null);
      setCategory(null);
      return;
    }
    const hM = h / 100;
    const val = w / (hM * hM);
    setBmi(val.toFixed(1));
    setCategory(getBMICategory(val));
  };

  const reset = () => {
    setHeightCm('');
    setWeightKg('');
    setBmi(null);
    setCategory(null);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-primary-200/50 overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 sm:p-3 bg-primary-100 rounded-xl">
          <FaCalculator className="text-primary-600 text-xl sm:text-2xl" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">BMI Calculator</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">Enter your height (cm) and weight (kg) to check your Body Mass Index.</p>
      <form onSubmit={calculate} className="space-y-4">
        <div>
          <label htmlFor="height-bmi" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaRulerVertical className="text-primary-500" /> Height (cm)
          </label>
          <input
            id="height-bmi"
            type="number"
            min="50"
            max="300"
            step="0.1"
            placeholder="e.g. 170"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
          />
        </div>
        <div>
          <label htmlFor="weight-bmi" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaWeight className="text-primary-500" /> Weight (kg)
          </label>
          <input
            id="weight-bmi"
            type="number"
            min="20"
            max="500"
            step="0.1"
            placeholder="e.g. 65"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          >
            Calculate
          </button>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
      {bmi && category && (
        <div className={`mt-6 p-4 rounded-xl border-2 ${category.border} ${category.bg}`}>
          <p className="text-sm font-semibold text-gray-700 mb-1">Your BMI</p>
          <p className={`text-2xl font-bold ${category.color}`}>{bmi} — {category.label}</p>
          <p className="text-xs text-gray-600 mt-2">This is for reference only. Consult a doctor for accurate assessment.</p>
        </div>
      )}
    </div>
  );
}
