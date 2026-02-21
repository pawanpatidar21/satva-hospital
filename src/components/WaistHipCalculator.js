import React, { useState } from 'react';
import { FaRuler } from 'react-icons/fa';

// WHR: waist / hip. Men: >0.9 abdominal obesity; Women: >0.85 abdominal obesity
// Lower = better for metabolic health
const getRiskCategory = (whr, gender) => {
  if (!whr || whr <= 0) return null;
  const maleHigh = 0.9;
  const femaleHigh = 0.85;
  const threshold = gender === 'male' ? maleHigh : femaleHigh;
  if (whr > threshold) return { label: 'High (abdominal obesity)', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-300' };
  if (whr > (threshold - 0.05)) return { label: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-300' };
  return { label: 'Low (healthy)', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-300' };
};

export default function WaistHipCalculator() {
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [gender, setGender] = useState('male');
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e?.preventDefault();
    const w = parseFloat(waist);
    const h = parseFloat(hip);
    if (!w || !h || w <= 0 || h <= 0) {
      setResult(null);
      return;
    }
    const whr = (w / h).toFixed(2);
    const category = getRiskCategory(parseFloat(whr), gender);
    setResult({ whr, category });
  };

  const reset = () => {
    setWaist('');
    setHip('');
    setResult(null);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-indigo-200/50 overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 sm:p-3 bg-indigo-100 rounded-xl">
          <FaRuler className="text-indigo-600 text-xl sm:text-2xl" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Waist-to-Hip Ratio</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">Measure waist (narrowest) and hip (widest) in cm. Indicates metabolic risk.</p>
      <form onSubmit={calculate} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Waist (cm)</label>
          <input type="number" min="40" max="200" step="0.1" placeholder="e.g. 80" value={waist} onChange={(e) => setWaist(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Hip (cm)</label>
          <input type="number" min="50" max="200" step="0.1" placeholder="e.g. 95" value={hip} onChange={(e) => setHip(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors">Calculate</button>
          <button type="button" onClick={reset} className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors">Reset</button>
        </div>
      </form>
      {result && (
        <div className={`mt-6 p-4 rounded-xl border-2 ${result.category.border} ${result.category.bg}`}>
          <p className="text-sm font-semibold text-gray-700 mb-1">Waist-to-Hip Ratio</p>
          <p className={`text-2xl font-bold ${result.category.color}`}>{result.whr}</p>
          <p className={`text-sm font-semibold mt-2 ${result.category.color}`}>{result.category.label}</p>
          <p className="text-xs text-gray-500 mt-2">Men: &gt;0.9 high risk. Women: &gt;0.85 high risk. For reference only.</p>
        </div>
      )}
    </div>
  );
}
