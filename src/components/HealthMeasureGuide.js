import React, { useState } from 'react';
import { FaBookMedical, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const GUIDE = [
  {
    tool: 'BMI (Body Mass Index)',
    who: 'Underweight <18.5, Normal 18.5–24.9, Overweight 25–29.9, Obese ≥30 (kg/m²)',
    india: 'ICMR/NIN: Same ranges. Asian Indians at higher cardio-metabolic risk; overweight often considered ≥23, obese ≥25.',
    use: 'Weight (kg) ÷ Height² (m²). Screening tool for underweight, overweight, obesity.',
  },
  {
    tool: 'Diabetic Calculator (HbA1c)',
    who: 'Normal <5.7%, Prediabetes 5.7–6.4%, Diabetes ≥6.5%. Target for diabetics: <7% (adults).',
    india: 'ICMR/IDF: Same. Target HbA1c <7% for most adults; may be individualised.',
    use: 'HbA1c reflects 2–3 month average blood glucose. eAG (mg/dL) = 28.7 × HbA1c − 46.7.',
  },
  {
    tool: 'Blood Glucose (mg/dL ↔ mmol/L)',
    who: 'Fasting: Normal <100, Prediabetes 100–125, Diabetes ≥126. Postprandial: Normal <140, Diabetes ≥200.',
    india: 'ICMR: Same cutoffs. Fasting ≥126 or 2-h post-glucose ≥200 confirms diabetes.',
    use: 'mmol/L = mg/dL × 0.0555. Used for lab unit conversion.',
  },
  {
    tool: 'Body Surface Area (BSA)',
    who: 'No health range. Average adult ~1.7–2.0 m². Used for drug dosing and clinical formulas.',
    india: 'Same. Mosteller formula: BSA = √[(Height cm × Weight kg) / 3600].',
    use: 'Drug dosing, chemotherapy, fluid therapy, burn area estimation.',
  },
  {
    tool: 'Ideal Body Weight (IBW)',
    who: 'No WHO standard. Devine formula used for dosing and weight targets.',
    india: 'Same. Male: 50 + 2.3×(height in −60). Female: 45.5 + 2.3×(height in −60).',
    use: 'Weight goal setting, drug dosing (e.g. aminoglycosides).',
  },
  {
    tool: 'Water Intake',
    who: '~2–2.5 L/day for adults. Higher with activity, heat, illness.',
    india: 'ICMR: ~2–2.5 L/day. 30–35 mL/kg body weight; varies with activity and climate.',
    use: 'General hydration. Skin health, metabolism, kidney function.',
  },
  {
    tool: 'Thyroid TSH',
    who: 'Normal 0.4–4.0 mIU/L. <0.4: possible hyperthyroidism; >4.0: possible hypothyroidism. Labs may use 0.5–5.0.',
    india: 'Similar. Many labs 0.4–4.0 or 0.5–5.0. AACE suggests 0.45–4.12. Trimester-specific in pregnancy.',
    use: 'Screening thyroid function. Interpretation needs clinical context.',
  },
  {
    tool: 'Calorie / BMR / TDEE',
    who: 'Mifflin-St Jeor equation. BMR = basal metabolic rate at rest. TDEE = BMR × activity factor.',
    india: 'ICMR uses similar equations. Activity factors: 1.2–1.9. No separate Indian BMR standard.',
    use: 'Weight management, diet planning. Activity levels: sedentary to very active.',
  },
  {
    tool: 'Waist-to-Hip Ratio (WHR)',
    who: 'Men: >0.90 = high metabolic risk. Women: >0.85 = high metabolic risk.',
    india: 'Same. Waist alone (cm): Men >90, Women >80 (Indian/Asian cutoff).',
    use: 'Abdominal obesity, cardio-metabolic risk. Measure waist (narrowest) and hip (widest).',
  },
  {
    tool: 'Fitzpatrick Skin Type',
    who: 'Phototype I–VI. Used for sun sensitivity, laser/UV treatment planning. Not a disease measure.',
    india: 'Same classification. Most Indians Type IV–VI. Guides sunscreen, laser settings.',
    use: 'Dermatology: laser suitability, sun protection, phototherapy dosing.',
  },
];

export default function HealthMeasureGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-10 sm:mt-12 max-w-7xl mx-auto">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border-2 border-primary-200/60 hover:border-primary-300 transition-colors text-left"
      >
        <span className="flex items-center gap-3 font-bold text-gray-900">
          <FaBookMedical className="text-primary-600 text-xl" />
          Health Measure Guide (WHO & Indian Standards)
        </span>
        {open ? <FaChevronUp className="text-primary-600 flex-shrink-0" /> : <FaChevronDown className="text-primary-600 flex-shrink-0" />}
      </button>
      {open && (
        <div className="mt-4 p-4 sm:p-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-2 border-primary-100 overflow-hidden">
          <p className="text-sm text-gray-600 mb-6">
            Reference ranges from WHO and Indian guidelines (ICMR, NIN, IDF, AACE). Use for interpretation only. Consult a doctor for diagnosis.
          </p>
          <div className="space-y-6">
            {GUIDE.map((item, i) => (
              <div key={i} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-2">{item.tool}</h4>
                <div className="grid gap-2 text-sm">
                  <div>
                    <span className="font-semibold text-primary-700">WHO:</span>{' '}
                    <span className="text-gray-700">{item.who}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-amber-700">India:</span>{' '}
                    <span className="text-gray-700">{item.india}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">How to use:</span>{' '}
                    <span className="text-gray-600">{item.use}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-6">
            Sources: WHO, ICMR, NIN, IDF, AACE. Standards may vary by lab and guideline updates.
          </p>
        </div>
      )}
    </div>
  );
}
