import React, { useState } from 'react';
import { FaCalculator, FaRulerVertical, FaWeight } from 'react-icons/fa';

// Mosteller formula: BSA (m²) = sqrt((height_cm × weight_kg) / 3600)
const calculateBSA = (heightCm, weightKg) => {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return null;
  const bsa = Math.sqrt((heightCm * weightKg) / 3600);
  return bsa.toFixed(2);
};

export default function BSACalculator() {
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [bsa, setBsa] = useState(null);

  const calculate = (e) => {
    e?.preventDefault();
    const val = calculateBSA(parseFloat(heightCm), parseFloat(weightKg));
    setBsa(val);
  };

  const reset = () => {
    setHeightCm('');
    setWeightKg('');
    setBsa(null);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-primary-200/50 overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 sm:p-3 bg-primary-100 rounded-xl">
          <FaCalculator className="text-primary-600 text-xl sm:text-2xl" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Body Surface Area</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">Enter height and weight. BSA is used for drug dosing and clinical calculations.</p>
      <form onSubmit={calculate} className="space-y-4">
        <div>
          <label htmlFor="height-bsa" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaRulerVertical className="text-primary-500" /> Height (cm)
          </label>
          <input
            id="height-bsa"
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
          <label htmlFor="weight-bsa" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaWeight className="text-primary-500" /> Weight (kg)
          </label>
          <input
            id="weight-bsa"
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
          <button type="submit" className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors">
            Calculate
          </button>
          <button type="button" onClick={reset} className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors">
            Reset
          </button>
        </div>
      </form>
      {bsa && (
        <div className="mt-6 p-4 rounded-xl border-2 border-primary-200 bg-primary-50">
          <p className="text-sm font-semibold text-gray-700 mb-1">Your BSA</p>
          <p className="text-2xl font-bold text-primary-600">{bsa} m²</p>
          <p className="text-xs text-gray-600 mt-2">Mosteller formula. For reference only.</p>
        </div>
      )}
    </div>
  );
}
