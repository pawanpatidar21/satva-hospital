import React, { useState } from 'react';
import { FaCalculator, FaRulerVertical, FaVenusMars } from 'react-icons/fa';

// Devine formula: Male IBW = 50 + 2.3*(height_in - 60), Female = 45.5 + 2.3*(height_in - 60)
// height_in = height_cm / 2.54
const calculateIBW = (heightCm, gender) => {
  if (!heightCm || heightCm <= 0) return null;
  const heightIn = heightCm / 2.54;
  if (heightIn < 60) {
    return gender === 'male' ? (45.5 + 2.3 * (heightIn - 60)).toFixed(1) : (41.5 + 2.3 * (heightIn - 60)).toFixed(1);
  }
  const ibw = gender === 'male' ? 50 + 2.3 * (heightIn - 60) : 45.5 + 2.3 * (heightIn - 60);
  return Math.max(0, ibw).toFixed(1);
};

export default function IdealWeightCalculator() {
  const [heightCm, setHeightCm] = useState('');
  const [gender, setGender] = useState('male');
  const [ibw, setIbw] = useState(null);

  const calculate = (e) => {
    e?.preventDefault();
    const h = parseFloat(heightCm);
    if (!h || h <= 0) {
      setIbw(null);
      return;
    }
    setIbw(calculateIBW(h, gender));
  };

  const reset = () => {
    setHeightCm('');
    setIbw(null);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-secondary-200/50 overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 sm:p-3 bg-secondary-100 rounded-xl">
          <FaCalculator className="text-secondary-600 text-xl sm:text-2xl" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Ideal Body Weight</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">Enter height and gender. IBW helps set weight goals.</p>
      <form onSubmit={calculate} className="space-y-4">
        <div>
          <label htmlFor="height-ibw" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaRulerVertical className="text-secondary-500" /> Height (cm)
          </label>
          <input
            id="height-ibw"
            type="number"
            min="100"
            max="250"
            step="0.1"
            placeholder="e.g. 170"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 outline-none"
          />
        </div>
        <div>
          <label htmlFor="gender-ibw" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaVenusMars className="text-secondary-500" /> Gender
          </label>
          <select
            id="gender-ibw"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 outline-none"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="flex-1 px-4 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-semibold rounded-xl transition-colors">
            Calculate
          </button>
          <button type="button" onClick={reset} className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors">
            Reset
          </button>
        </div>
      </form>
      {ibw && (
        <div className="mt-6 p-4 rounded-xl border-2 border-secondary-200 bg-secondary-50">
          <p className="text-sm font-semibold text-gray-700 mb-1">Ideal Body Weight</p>
          <p className="text-2xl font-bold text-secondary-600">{ibw} kg</p>
          <p className="text-xs text-gray-600 mt-2">Devine formula. For reference only.</p>
        </div>
      )}
    </div>
  );
}
