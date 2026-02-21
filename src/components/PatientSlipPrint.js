import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { getDoctors, getClinic } from '../services/localStorageApi';

/**
 * Printable patient slip with doctor selection (doctor-wise slip).
 * Uses portal so print shows only the slip (not the main app).
 */
const PatientSlipPrint = ({ appointment, onClose }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [doctorsData, clinicData] = await Promise.all([getDoctors(), getClinic()]);
        setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
        setClinic(clinicData || {});
        if (Array.isArray(doctorsData) && doctorsData.length > 0) {
          setSelectedDoctorId((prev) => prev || String(doctorsData[0].id));
        }
      } catch (e) {
        setDoctors([]);
      }
    };
    load();
  }, []);

  const selectedDoctor = doctors.find((d) => String(d.id) === selectedDoctorId);

  const handlePrint = () => {
    window.print();
  };

  if (!appointment) return null;

  const slipContent = (
    <>
      <style>{`
        @media print {
          #root { display: none !important; }
          #slip-print-root {
            display: block !important;
            position: static !important;
            background: white !important;
            padding: 0 !important;
          }
          #slip-print-root .no-print { display: none !important; }
          .slip-watermark { opacity: 0.08 !important; }
        }
        .slip-watermark { opacity: 0.05; }
        @media screen {
          #slip-print-root .patient-slip-print { max-width: 420px; }
        }
      `}</style>

      <div
        id="slip-print-root"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
      >
        <div
          className="no-print absolute inset-0"
          onClick={onClose}
          aria-hidden
        />
        <div
          className="patient-slip-print relative z-10 bg-white rounded-xl shadow-2xl p-6 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sattva watermark - visible on screen and print */}
          <div
            className="slip-watermark absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{ transform: 'rotate(-25deg)' }}
            aria-hidden
          >
            <div className="text-center">
              <span className="block text-7xl font-black text-gray-700 tracking-wider">सत्त्व</span>
              <span className="block text-4xl font-bold text-gray-500 tracking-[0.3em] mt-1">Sattva</span>
            </div>
          </div>

          {/* Doctor selector - screen only */}
          <div className="no-print mb-4 pb-4 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Doctor for Slip</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.englishName || d.name} ({d.type || 'Doctor'})
                </option>
              ))}
              {doctors.length === 0 && (
                <option value="">No doctors available</option>
              )}
            </select>
          </div>

          {/* Slip content - printed */}
          <div className="relative z-10 space-y-4">
            {/* Clinic header with logo area */}
            <div className="text-center border-b-2 border-teal-600 pb-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-3xl font-black text-teal-700">सत्त्व</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900">
                {clinic?.englishName || clinic?.name || 'Sattva'} Clinic
              </h1>
              {clinic?.fullName && (
                <p className="text-xs text-gray-600 mt-1">{clinic.fullName}</p>
              )}
              {clinic?.location && (
                <p className="text-xs text-gray-600">{clinic.location}</p>
              )}
            </div>

            {/* Patient appointment slip */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Patient Slip</p>

              <div className="space-y-2.5 text-sm">
                <div className="flex">
                  <span className="text-gray-500 w-20 flex-shrink-0">Patient:</span>
                  <span className="font-bold text-gray-900">{appointment.name || '—'}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-20 flex-shrink-0">Phone:</span>
                  <span className="text-gray-900">{appointment.phone || '—'}</span>
                </div>
                {appointment.email && (
                  <div className="flex">
                    <span className="text-gray-500 w-20 flex-shrink-0">Email:</span>
                    <span className="text-gray-900">{appointment.email}</span>
                  </div>
                )}
                <div className="flex">
                  <span className="text-gray-500 w-20 flex-shrink-0">Service:</span>
                  <span className="text-gray-900">{appointment.service || '—'}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-20 flex-shrink-0">Date:</span>
                  <span className="font-medium text-gray-900">
                    {appointment.date
                      ? new Date(appointment.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-20 flex-shrink-0">Time:</span>
                  <span className="font-medium text-gray-900">
                    {appointment.time ? `${appointment.time} ${appointment.period || 'AM'}` : '—'}
                  </span>
                </div>
                {selectedDoctor && (
                  <div className="pt-2.5 mt-2 border-t border-gray-200">
                    <div className="flex">
                      <span className="text-gray-500 w-20 flex-shrink-0">Doctor:</span>
                      <span className="font-bold text-gray-900">{selectedDoctor.englishName || selectedDoctor.name}</span>
                    </div>
                    {selectedDoctor.type && (
                      <div className="flex mt-0.5">
                        <span className="w-20 flex-shrink-0" />
                        <span className="text-gray-600 text-xs">({selectedDoctor.type})</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions - screen only */}
          <div className="no-print flex gap-3 mt-6 relative z-10">
            <button
              onClick={handlePrint}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700"
            >
              Print Slip
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(slipContent, document.body);
};

export default PatientSlipPrint;
