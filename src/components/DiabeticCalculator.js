import React, { useState } from 'react';
import { FaTint, FaExchangeAlt } from 'react-icons/fa';

// HbA1c to eAG: eAG (mg/dL) = 28.7 × HbA1c - 46.7
// Blood glucose: mmol/L = mg/dL × 0.0555
const hba1cToEAG = (hba1c) => (28.7 * hba1c - 46.7).toFixed(1);
const mgToMmol = (mg) => (mg * 0.0555).toFixed(1);
const mmolToMg = (mmol) => (mmol / 0.0555).toFixed(0);

export default function DiabeticCalculator() {
  const [activeTab, setActiveTab] = useState('hba1c'); // 'hba1c' | 'glucose'
  const [hba1c, setHba1c] = useState('');
  const [glucoseValue, setGlucoseValue] = useState('');
  const [glucoseUnit, setGlucoseUnit] = useState('mg'); // 'mg' or 'mmol'
  const [result, setResult] = useState(null);

  const calculateHbA1c = (e) => {
    e?.preventDefault();
    const val = parseFloat(hba1c);
    if (!val || val < 4 || val > 20) {
      setResult(null);
      return;
    }
    const eag = hba1cToEAG(val);
    const mmol = mgToMmol(eag);
    setResult({ eag, mmol, hba1c: val });
  };

  const convertGlucose = (e) => {
    e?.preventDefault();
    const val = parseFloat(glucoseValue);
    if (!val || val <= 0) {
      setResult(null);
      return;
    }
    if (glucoseUnit === 'mg') {
      setResult({ from: val, fromUnit: 'mg/dL', to: mgToMmol(val), toUnit: 'mmol/L' });
    } else {
      setResult({ from: val, fromUnit: 'mmol/L', to: mmolToMg(val), toUnit: 'mg/dL' });
    }
  };

  const reset = () => {
    setHba1c('');
    setGlucoseValue('');
    setResult(null);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-secondary-200/50 overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 sm:p-3 bg-secondary-100 rounded-xl">
          <FaTint className="text-secondary-600 text-xl sm:text-2xl" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Diabetic Calculator</h3>
      </div>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => { setActiveTab('hba1c'); setResult(null); }}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-colors ${
            activeTab === 'hba1c' ? 'bg-secondary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          HbA1c → eAG
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('glucose'); setResult(null); }}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-colors ${
            activeTab === 'glucose' ? 'bg-secondary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Glucose Units
        </button>
      </div>

      {activeTab === 'hba1c' && (
        <form onSubmit={calculateHbA1c} className="space-y-4">
          <p className="text-sm text-gray-600">Convert HbA1c to Estimated Average Glucose (eAG).</p>
          <div>
            <label htmlFor="hba1c" className="block text-sm font-semibold text-gray-700 mb-2">HbA1c (%)</label>
            <input
              id="hba1c"
              type="number"
              min="4"
              max="20"
              step="0.1"
              placeholder="e.g. 7.0"
              value={hba1c}
              onChange={(e) => setHba1c(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 outline-none"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-semibold rounded-xl transition-colors">
              Calculate
            </button>
            <button type="button" onClick={reset} className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors">
              Reset
            </button>
          </div>
          {result?.eag && (
            <div className="mt-6 p-4 rounded-xl border-2 border-secondary-200 bg-secondary-50">
              <p className="text-sm font-semibold text-gray-700 mb-2">Estimated Average Glucose</p>
              <p className="text-xl font-bold text-secondary-600">{result.eag} mg/dL</p>
              <p className="text-sm text-gray-600 mt-1">{result.mmol} mmol/L</p>
              <p className="text-xs text-gray-500 mt-2">Target: &lt;7% HbA1c for most adults. Consult your doctor.</p>
            </div>
          )}
        </form>
      )}

      {activeTab === 'glucose' && (
        <form onSubmit={convertGlucose} className="space-y-4">
          <p className="text-sm text-gray-600">Convert between mg/dL and mmol/L.</p>
          <div>
            <label htmlFor="glucose" className="block text-sm font-semibold text-gray-700 mb-2">Blood Glucose</label>
            <div className="flex gap-2">
              <input
                id="glucose"
                type="number"
                min="0"
                step="0.1"
                placeholder={glucoseUnit === 'mg' ? 'e.g. 126' : 'e.g. 7.0'}
                value={glucoseValue}
                onChange={(e) => setGlucoseValue(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 outline-none"
              />
              <select
                value={glucoseUnit}
                onChange={(e) => setGlucoseUnit(e.target.value)}
                className="px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-secondary-500 outline-none"
              >
                <option value="mg">mg/dL</option>
                <option value="mmol">mmol/L</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              <FaExchangeAlt /> Convert
            </button>
            <button type="button" onClick={reset} className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors">
              Reset
            </button>
          </div>
          {result?.to && (
            <div className="mt-6 p-4 rounded-xl border-2 border-secondary-200 bg-secondary-50">
              <p className="text-sm font-semibold text-gray-700 mb-1">Result</p>
              <p className="text-xl font-bold text-secondary-600">{result.from} {result.fromUnit} = {result.to} {result.toUnit}</p>
            </div>
          )}
        </form>
      )}

      <p className="text-xs text-gray-500 mt-4">For reference only. Not a substitute for medical advice.</p>
    </div>
  );
}
