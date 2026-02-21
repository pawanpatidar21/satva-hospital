import React, { useState } from 'react';
import { FaCalculator, FaVial } from 'react-icons/fa';

// Typical reference: 0.4–4.0 mIU/L (normal), <0.4 possible hyperthyroidism, >4.0 possible hypothyroidism
// Some labs use 0.5–5.0. We'll use 0.4–4.0 as standard.
const interpretTSH = (tsh) => {
  if (!tsh || tsh <= 0) return null;
  if (tsh < 0.4) return { label: 'Possible hyperthyroidism', color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-300', note: 'TSH is low. Thyroid may be overactive.' };
  if (tsh <= 4.0) return { label: 'Normal range', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-300', note: 'TSH is within typical reference range (0.4–4.0 mIU/L).' };
  return { label: 'Possible hypothyroidism', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-300', note: 'TSH is elevated. Thyroid may be underactive.' };
};

export default function ThyroidTSHCalculator() {
  const [tsh, setTsh] = useState('');
  const [result, setResult] = useState(null);

  const interpret = (e) => {
    e?.preventDefault();
    const val = parseFloat(tsh);
    if (!val || val < 0) {
      setResult(null);
      return;
    }
    setResult(interpretTSH(val));
  };

  const reset = () => {
    setTsh('');
    setResult(null);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-primary-200/50 overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 sm:p-3 bg-primary-100 rounded-xl">
          <FaVial className="text-primary-600 text-xl sm:text-2xl" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Thyroid TSH</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">Enter your TSH level (mIU/L) to see a general interpretation.</p>
      <form onSubmit={interpret} className="space-y-4">
        <div>
          <label htmlFor="tsh" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaCalculator className="text-primary-500" /> TSH (mIU/L)
          </label>
          <input
            id="tsh"
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="e.g. 2.5"
            value={tsh}
            onChange={(e) => setTsh(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors">
            Interpret
          </button>
          <button type="button" onClick={reset} className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors">
            Reset
          </button>
        </div>
      </form>
      {result && (
        <div className={`mt-6 p-4 rounded-xl border-2 ${result.border} ${result.bg}`}>
          <p className={`text-lg font-bold ${result.color}`}>{result.label}</p>
          <p className="text-sm text-gray-700 mt-1">{result.note}</p>
          <p className="text-xs text-gray-500 mt-2">Reference: 0.4–4.0 mIU/L. Lab ranges may vary. Consult your doctor.</p>
        </div>
      )}
    </div>
  );
}
