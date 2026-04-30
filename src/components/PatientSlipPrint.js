import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { getDoctors, getClinic } from '../services/localStorageApi';

/** Exact footer text from prescription slip */
const SLIP_SERVICES = [
  '* डायबिटीज थायराइड हार्मोन समस्या मोटापा PCOD * अनियमित महावारी बल्ड प्रेशर',
  '* कद ना बढ़ना चर्म रोग एलर्जी दाग झांईया गंजापन हेयर ट्रांसप्लांट गुप्त रोग कार्बन पील',
  '* PRP/GFC, Laser Hair Removal, Laser for Acne scar हाइडराफेशियल ** लेजर प्री-ब्राइडल ग्लो ट्रीटमेंट',
];

/**
 * Printable prescription slip – exact layout as reference. Pre-printed content only;
 * fillable areas are blank underlines (patient name & date from appointment, rest blank).
 */
const PatientSlipPrint = ({ appointment, onClose }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [doctorsData, clinicData] = await Promise.all([getDoctors(), getClinic()]);
        const list = Array.isArray(doctorsData) ? doctorsData : [];
        setDoctors(list);
        setClinic(clinicData || {});
        if (list.length > 0) {
          setSelectedDoctorId((prev) => prev || String(list[0].id));
        }
      } catch (e) {
        setDoctors([]);
      }
    };
    load();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!appointment) return null;

  // Display order: Dr. Chetan (id 2) first, then Dr. Diksha (id 1) – as on reference slip
  const doctorsOrdered = [...doctors].sort((a, b) => (a.id === 2 ? -1 : b.id === 2 ? 1 : a.id - b.id));

  const slipAddress = clinic?.slipAddress || 'पुराना देवधर डायग्नोस्टिक सेंटर, गुप्ता पुलिया के पास, नीमच (म.प्र.)';
  const mobile = clinic?.contact?.phone2 || clinic?.contact?.phone1 || '9340633407';
  const disclaimer = clinic?.consultationDisclaimer || 'परामर्श शुल्क 10 दिनों तक मान्य | कृपया दवाईयों का सेवन डॉक्टर को दिखाकर ही करें। No Substitution Please';

  const dateStr = appointment.date
    ? new Date(appointment.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-')
    : '';

  const slipContent = (
    <>
      <style>{`
        .slip-paper {
          font-family: Georgia, 'Times New Roman', 'Noto Serif Devanagari', serif;
          background: #fff;
          color: #000;
        }
        /* Doctor names: bold dark blue */
        .slip-doctor-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e3a8a;
          letter-spacing: 0.02em;
        }
        /* Qualifications etc: standard black */
        .slip-doctor-details {
          font-size: 0.7rem;
          line-height: 1.4;
          color: #000;
          margin-top: 0.25rem;
          font-weight: 400;
        }
        /* Maroon block - top right branding (rounded bottom-right) */
        .slip-clinic-block {
          background: #7f1d1d;
          color: #fff;
          font-weight: 700;
          letter-spacing: 0.02em;
          border-bottom-right-radius: 8px;
        }
        .slip-clinic-title { font-size: 1.2rem; font-weight: 800; }
        .slip-clinic-sub { font-size: 0.6rem; line-height: 1.35; font-weight: 500; opacity: 0.98; }
        /* Logo circle left of maroon - orange/gold */
        .slip-logo-circle {
          width: 52px; height: 52px;
          border: 2px solid rgba(217, 119, 6, 0.4);
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(217,119,6,0.2) 100%);
          flex-shrink: 0;
        }
        /* Instructions: black standard */
        .slip-instruction { font-size: 0.72rem; color: #000; font-weight: 400; }
        .slip-instruction-en { font-size: 0.65rem; color: #1f2937; }
        /* Labels: standard black */
        .slip-label { font-size: 0.75rem; color: #000; font-weight: 500; }
        .slip-rx-adv { font-size: 0.8rem; font-weight: 700; color: #000; }
        .slip-vitals { font-size: 0.7rem; color: #000; font-weight: 400; }
        /* Footer: dark blue strip with white text - full width of slip */
        .slip-footer-strip {
          background: #1e3a8a;
          color: #fff;
          font-size: 0.65rem;
          line-height: 1.45;
          font-weight: 400;
          padding: 0.5rem 0.75rem;
          margin-left: -1.25rem;
          margin-right: -1.25rem;
          margin-bottom: 0;
          padding-left: 1.25rem;
          padding-right: 1.25rem;
        }
        .slip-footer-strip div { color: #fff; }
        /* सुविधाएँ: red box, white text */
        .slip-facilities-label {
          display: inline-block;
          background: #b91c1c;
          color: #fff;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          margin-top: 0.4rem;
          margin-bottom: 0.25rem;
        }
        .slip-facilities-list { font-size: 0.62rem; line-height: 1.4; color: #000; }
        .slip-watermark {
          opacity: 0.07;
          pointer-events: none;
          font-family: inherit;
          color: #b45309;
        }
        .slip-ul { border-bottom: 1px solid #000; display: inline-block; min-width: 80px; }
        .slip-ul-lg { border-bottom: 1px solid #000; display: inline-block; min-width: 140px; }
        .slip-ul-xl { border-bottom: 1px solid #000; display: inline-block; min-width: 200px; }
        .slip-body { display: flex; flex-direction: column; min-height: 0; flex: 1; }
        .slip-prescription-space { flex: 1; min-height: 120mm; }
        @media print {
          #root { display: none !important; }
          #slip-print-root {
            display: block !important;
            position: static !important;
            background: white !important;
            padding: 0 !important;
          }
          #slip-print-root .no-print { display: none !important; }
          #slip-print-root .slip-scroll-wrap { padding: 0 !important; overflow: visible !important; }
          .slip-watermark { opacity: 0.06 !important; color: #b45309 !important; }
          .slip-paper { box-shadow: none !important; border: none !important; }
          .slip-doctor-name { color: #1e3a8a !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .slip-clinic-block, .slip-footer-strip, .slip-facilities-label {
            -webkit-print-color-adjust: exact; print-color-adjust: exact;
          }
          .slip-footer-strip { margin-left: -1.5rem; margin-right: -1.5rem; padding-left: 1.5rem; padding-right: 1.5rem; }
        }
        @media screen {
          #slip-print-root .slip-paper { max-width: 210mm; }
        }
      `}</style>

      <div id="slip-print-root" className="fixed inset-0 z-[9999] flex flex-col bg-black/50">
        {/* Top bar: doctor selector - always visible */}
        <div className="no-print flex-shrink-0 p-4 bg-gray-100 border-b border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Doctor for Slip</label>
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>{d.englishName || d.name} ({d.type || 'Doctor'})</option>
            ))}
            {doctors.length === 0 && <option value="">No doctors available</option>}
          </select>
        </div>

        {/* Scrollable area: slip paper */}
        <div
          className="slip-scroll-wrap flex-1 min-h-0 overflow-y-auto overflow-x-auto p-4 flex justify-center"
          onClick={onClose}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
          aria-label="Click outside slip to close"
        >
          <div
            className="slip-paper relative z-10 bg-white overflow-hidden text-black flex flex-col flex-shrink-0 shadow-xl rounded"
            style={{ width: '210mm', minHeight: '297mm' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Faint watermark */}
            <div
              className="slip-watermark absolute inset-0 flex items-center justify-center select-none"
              style={{ transform: 'rotate(-22deg)', fontSize: '7rem', fontWeight: 800, color: '#999' }}
              aria-hidden
            >
              सत्त्व
            </div>

            <div className="relative z-10 flex flex-col flex-1 min-h-0 p-5 print:p-6 leading-tight">
            {/* Header: Doctors left | Logo circle + Maroon block right */}
            <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-2">
              <div className="flex-1 pr-2">
                {doctorsOrdered.map((d) => (
                  <div key={d.id} className="mb-2.5">
                    <span className="slip-doctor-name">{d.name}</span>
                    {String(d.id) === selectedDoctorId ? (
                      <span className="ml-1 text-blue-600 font-bold">✓</span>
                    ) : (
                      <span className="ml-1 text-gray-400">○</span>
                    )}
                    <div className="slip-doctor-details">
                      <div>{d.qualifications}</div>
                      {d.specialization && <div>{d.specialization}</div>}
                      {d.experience && <div className="italic">{d.experience}</div>}
                      {d.mpNumber && <div className="font-semibold mt-0.5">{d.mpNumber}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="slip-logo-circle flex items-center justify-center text-amber-600 font-bold text-xs" aria-hidden>स</div>
                <div className="slip-clinic-block px-4 py-2.5 text-right" style={{ minWidth: '138px' }}>
                  <div className="slip-clinic-title">सत्त्व</div>
                  <div className="slip-clinic-sub">स्किन डायबिटीज थायरॉइड & एंडोक्राइनोलॉजी हॉस्पिटल</div>
                </div>
              </div>
            </div>

            <div className="slip-instruction border-b border-black pb-1.5 mb-2 text-center">
              <span>हर वार सभी दवाईयाँ व पुराने पर्चे साथ लायें।</span>
              <span className="slip-instruction-en block mt-0.5">Bring all Medicines & Previous Prescription on every visit.</span>
            </div>

            {/* Patient & Date/Age/Sex */}
            <div className="flex justify-between items-start gap-4 mb-2">
              <div>
                <span className="slip-label mr-2">Pt. Name</span>
                <span className="slip-ul-xl">{appointment.name || ''}</span>
              </div>
              <div className="flex gap-4 flex-shrink-0 slip-label">
                <span>Date <span className="slip-ul slip-ul-lg">{dateStr}</span></span>
                <span>Age <span className="slip-ul">{appointment.age ?? ''}</span></span>
                <span>Sex <span className="slip-ul">{appointment.sex ?? ''}</span></span>
              </div>
            </div>
            <div className="mb-3">
              <span className="slip-label mr-2">Address</span>
              <span className="slip-ul-xl">{appointment.address ?? ''}</span>
            </div>

            {/* Vitals (left) | Rx & Adv (right) */}
            <div className="flex gap-8 border border-black p-2.5 mb-2 min-h-[130px]">
              <div className="flex-shrink-0 space-y-0.5 slip-vitals">
                <div>Pulse <span className="slip-ul"></span></div>
                <div>SPO2 <span className="slip-ul"></span></div>
                <div>BP <span className="slip-ul"></span></div>
                <div>Temp <span className="slip-ul"></span></div>
                <div>Weight <span className="slip-ul"></span></div>
                <div>Height <span className="slip-ul"></span></div>
                <div>BMI <span className="slip-ul"></span></div>
                <div>RBG <span className="slip-ul"></span> mg/dl</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="slip-rx-adv mb-0.5">Rx</div>
                <div className="slip-vitals mb-0.5">Asis- <span className="slip-ul slip-ul-xl"></span></div>
                <div className="slip-vitals mb-0.5">Clo- <span className="slip-ul slip-ul-xl"></span></div>
                <div className="slip-vitals mb-1">NO H/O <span className="slip-ul slip-ul-lg"></span></div>
                <div className="slip-rx-adv mb-0.5">Adv</div>
                <ol className="list-decimal list-inside slip-vitals space-y-0.5">
                  <li><span className="slip-ul slip-ul-xl"></span></li>
                  <li><span className="slip-ul slip-ul-xl"></span></li>
                  <li><span className="slip-ul slip-ul-xl"></span></li>
                  <li><span className="slip-ul slip-ul-xl"></span></li>
                </ol>
              </div>
            </div>

            <div className="slip-vitals mb-1">Investigations: <span className="slip-ul slip-ul-xl"></span></div>
            <div className="slip-vitals mb-2">Follow-up: <span className="slip-ul slip-ul-lg"></span></div>

            {/* Middle: blank space for doctor to write prescription */}
            <div className="slip-prescription-space flex-1 min-h-[120mm] border border-gray-300 border-dashed mt-2 print:min-h-[140mm]" />

            {/* Footer: dark blue strip + red सुविधाएँ box + black list */}
            <div className="mt-auto flex-shrink-0 pt-1">
              <div className="slip-footer-strip space-y-0.5">
                <div>{disclaimer}</div>
                <div>{slipAddress} मोबाइल : {mobile}</div>
              </div>
              <div className="bg-white pt-1">
                <span className="slip-facilities-label">सुविधाएँ :</span>
                <div className="slip-facilities-list space-y-0.5">
                  {SLIP_SERVICES.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Bottom bar: Print & Close - always visible */}
        <div className="no-print flex-shrink-0 flex gap-3 p-4 bg-gray-100 border-t border-gray-300">
          <button type="button" onClick={handlePrint} className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 shadow">
            Print Slip
          </button>
          <button type="button" onClick={onClose} className="px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(slipContent, document.body);
};

export default PatientSlipPrint;
