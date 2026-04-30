/**
 * Sattva Clinic - localStorage API
 * Replaces backend API so the app works with frontend-only deployment.
 * All data is stored in the browser's localStorage.
 * Patient data (appointments, doctors, admin credentials) is encrypted at rest.
 */

import CryptoJS from 'crypto-js';
import * as XLSX from 'xlsx';
import {
  cloudSaveAppointment,
  cloudDeleteAppointment,
  cloudBulkSaveAppointments,
  cloudSaveDoctor,
  cloudDeleteDoctor,
  cloudBulkSaveDoctors,
  initialSync,
  subscribeToAppointments,
  subscribeToDoctors,
  FIREBASE_ENABLED,
} from './cloudSync';

const STORAGE_KEYS = {
  APPOINTMENTS: 'Sattva_appointments',
  DOCTORS: 'Sattva_doctors',
  ADMIN_CREDENTIALS: 'Sattva_admin_credentials', // optional override
  NEXT_APPOINTMENT_ID: 'Sattva_next_appointment_id',
  NEXT_DOCTOR_ID: 'Sattva_next_doctor_id',
};

// Keys that contain sensitive patient/admin data - encrypted at rest
const ENCRYPTED_KEYS = [
  STORAGE_KEYS.APPOINTMENTS,
  STORAGE_KEYS.DOCTORS,
  STORAGE_KEYS.ADMIN_CREDENTIALS,
];

// Encryption key: set REACT_APP_ENCRYPTION_KEY in .env for production
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'Sattva-clinic-patient-data-2026';

function encrypt(text) {
  try {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  } catch (e) {
    return text;
  }
}

function decrypt(ciphertext) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (e) {
    return null;
  }
}

// Default admin credentials (change via Sattva_admin_credentials in localStorage if needed)
const DEFAULT_ADMIN = { username: 'adminSatva', password: 'Satva#2026' };

// Default clinic info (from backend)
const DEFAULT_CLINIC = {
  name: 'सत्त्व',
  englishName: 'Sattva',
  fullName: 'स्किन, डायबिटीज़ थायराइड & एंडोक्राइनोलोजी क्लिनीक, नीमच',
  location: 'Neemuch',
  contact: { phone1: '9131960802', phone2: '9340633407' },
  specializations: ['Skin', 'Diabetes', 'Thyroid', 'Endocrinology'],
  /** For prescription slip footer */
  slipAddress: 'पुराना देवधर डायग्नोस्टिक सेंटर, गुप्ता पुलिया के पास, नीमच (म.प्र.)',
  consultationDisclaimer: 'परामर्श शुल्क 10 दिनों तक मान्य | कृपया दवाईयों का सेवन डॉक्टर को दिखाकर ही करें। No Substitution Please',
};

// Default services (from backend)
const DEFAULT_SERVICES = {
  endocrinology: [
    'डायबिटीज़, थायराइड', 'ब्लड प्रेशर', 'मोटापा', 'PCOD, अनियमित माहवारी',
    'हार्मोन संबंधित समस्याओं का इलाज', 'बच्चो में कद ना बढ़ना', 'MALE HYPOGONADISM',
    'OSTEOPOROSIS', 'GYNECOMASTIA', 'PITUTARY TUMOR', 'ADRENAL DISORDERS',
  ],
  dermatology: [
    'दाद, खाद, खुजली', 'एलर्जी, एक्जिमा, सोरियसिस', 'दाग, झाइयां', 'गंजेपन का इलाज',
    'PRP/GFC', 'हेयर ट्रांसप्लांट', 'LASER HAIR REMOVAL', 'LASER FOR ACNE SCAR & PIGMENTATION',
    'केमिकल पील फॉर ग्लो', 'हाइडराफ़ेशियल, कार्बन पील', 'प्री-ब्राइडल ग्लो ट्रीटमेंट',
  ],
};

// Default doctors (from backend) - profile images in public/doctors/
const DEFAULT_DOCTORS = [
  {
    id: 1,
    name: 'डॉ. दीक्षा पाटीदार',
    englishName: 'Dr. Diksha Patidar',
    qualifications: 'एम.डी. मेडिसिन (एम्स दिल्ली)',
    specialization: 'डी.आर.एन.बी. एंडोक्राइनोलॉजी (हार्मोन रोग विशेषज्ञ), सफदरजंग हॉस्पिटल, दिल्ली',
    title: 'हार्मोन रोग विशेषज्ञ',
    type: 'Endocrinologist',
    image: `${process.env.PUBLIC_URL || ''}/doctors/dr-diksha.png`,
    experience: '',
    mpNumber: 'MP-46249',
  },
  {
    id: 2,
    name: 'डॉ. चेतन कुमार पाटीदार',
    englishName: 'Dr. Chetan Kumar Patidar',
    qualifications: 'एम.डी. चर्म, यौन एवं कुष्ठ रोग विशेषज्ञ',
    specialization: 'सफदरजंग हॉस्पिटल, दिल्ली',
    experience: 'Ex. Consultant ESIC medical college',
    type: 'Dermatologist',
    image: `${process.env.PUBLIC_URL || ''}/doctors/dr-chetan.png`,
    mpNumber: 'MP-23109',
  },
];

// Simple in-memory token for "session" (no real JWT needed)
const LOCAL_ADMIN_TOKEN = 'Sattva_local_admin_token';

function getJson(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;

    if (ENCRYPTED_KEYS.includes(key)) {
      const decrypted = decrypt(raw);
      // Support migration: legacy unencrypted data parses as JSON
      const text = decrypted !== null ? decrypted : raw;
      return text ? JSON.parse(text) : defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setJson(key, value) {
  const jsonStr = JSON.stringify(value);
  if (ENCRYPTED_KEYS.includes(key)) {
    localStorage.setItem(key, encrypt(jsonStr));
  } else {
    localStorage.setItem(key, jsonStr);
  }
}

function getNextId(key) {
  const id = (getJson(key, 1) || 1);
  setJson(key, id + 1);
  return id;
}

// Map service name to doctor type (Endocrinologist / Dermatologist / etc.)
export function getServiceDoctorType(service) {
  if (!service) return '';
  const s = String(service).trim();
  if (DEFAULT_SERVICES.endocrinology.some((svc) => svc === s || svc.includes(s) || s.includes(svc))) {
    return 'Endocrinologist';
  }
  if (DEFAULT_SERVICES.dermatology.some((svc) => svc === s || svc.includes(s) || s.includes(svc))) {
    return 'Dermatologist';
  }
  return '';
}

/**
 * Get time slots already booked for a given date and doctor type.
 * Used to hide those slots when booking (each doctor type has its own slot pool).
 * @param {string} date - YYYY-MM-DD
 * @param {string} doctorType - e.g. 'Endocrinologist', 'Dermatologist'
 * @param {number} [excludeAppointmentId] - When editing, exclude this appointment's time
 * @returns {string[]} - Array of time values e.g. ['09:00', '10:30']
 */
export function getBookedTimeSlotsForDoctorType(date, doctorType, excludeAppointmentId) {
  if (!date || !doctorType) return [];
  const list = getAppointmentsList();
  return list
    .filter(
      (apt) =>
        apt.date === date &&
        apt.status !== 'cancelled' &&
        apt.time &&
        getServiceDoctorType(apt.service) === doctorType &&
        (!excludeAppointmentId || apt.id !== excludeAppointmentId)
    )
    .map((apt) => apt.time);
}

// ----- Clinic -----
export function getClinic() {
  return Promise.resolve(DEFAULT_CLINIC);
}

// ----- Services -----
export function getServices() {
  return Promise.resolve(DEFAULT_SERVICES);
}

// ----- Doctors -----
function getDoctorsList() {
  const stored = getJson(STORAGE_KEYS.DOCTORS, null);
  if (Array.isArray(stored) && stored.length > 0) {
    // Backfill image from DEFAULT_DOCTORS if stored doctor has no image or old placeholder
    const defaultById = Object.fromEntries((DEFAULT_DOCTORS || []).map((d) => [d.id, d]));
    const isPlaceholderOrEmpty = (url) =>
      !url || url === '' || String(url).includes('dummyimage.com');
    let updated = false;
    const merged = stored.map((d) => {
      const def = defaultById[d.id];
      if (def && isPlaceholderOrEmpty(d.image) && def.image) {
        updated = true;
        return { ...d, image: def.image };
      }
      return d;
    });
    if (updated) setJson(STORAGE_KEYS.DOCTORS, merged);
    return merged;
  }
  // Seed default doctors into localStorage on first use
  setJson(STORAGE_KEYS.DOCTORS, DEFAULT_DOCTORS);
  setJson(STORAGE_KEYS.NEXT_DOCTOR_ID, 3);
  return DEFAULT_DOCTORS;
}

export function getDoctors() {
  return Promise.resolve(getDoctorsList());
}

export function getAdminDoctors() {
  return Promise.resolve({ success: true, doctors: getDoctorsList() });
}

export function createDoctor(data) {
  const doctors = getDoctorsList();
  const id = getJson(STORAGE_KEYS.NEXT_DOCTOR_ID, doctors.length + 1);
  const doctor = {
    id,
    name: data.name || '',
    englishName: data.englishName || '',
    qualifications: data.qualifications || '',
    specialization: data.specialization || '',
    title: data.title || '',
    type: data.type || '',
    experience: data.experience || '',
    image: data.image || '',
    mpNumber: data.mpNumber || '',
  };
  doctors.push(doctor);
  setJson(STORAGE_KEYS.DOCTORS, doctors);
  setJson(STORAGE_KEYS.NEXT_DOCTOR_ID, id + 1);
  cloudSaveDoctor(doctor); // fire-and-forget cloud sync
  return Promise.resolve({ success: true, doctor });
}

export function updateDoctor(id, data) {
  const doctors = getDoctorsList();
  const index = doctors.findIndex((d) => d.id === parseInt(id, 10));
  if (index === -1) return Promise.resolve(null);
  doctors[index] = { ...doctors[index], ...data };
  setJson(STORAGE_KEYS.DOCTORS, doctors);
  cloudSaveDoctor(doctors[index]); // fire-and-forget cloud sync
  return Promise.resolve({ success: true, doctor: doctors[index] });
}

export function deleteDoctor(id) {
  const doctors = getDoctorsList();
  const index = doctors.findIndex((d) => d.id === parseInt(id, 10));
  if (index === -1) return Promise.resolve({ success: false });
  doctors.splice(index, 1);
  setJson(STORAGE_KEYS.DOCTORS, doctors);
  cloudDeleteDoctor(id); // fire-and-forget cloud sync
  return Promise.resolve({ success: true, message: 'Doctor deleted successfully' });
}

// ----- Appointments -----
function getAppointmentsList() {
  return getJson(STORAGE_KEYS.APPOINTMENTS, []);
}

function saveAppointments(list) {
  setJson(STORAGE_KEYS.APPOINTMENTS, list);
}

// ─── Cloud sync bootstrap ───────────────────────────────────────────────────

/**
 * Call once on app start (inside a useEffect in App.js or AuthContext).
 * Pulls data from Firestore if configured; pushes local data if Firestore is empty.
 */
export async function initialCloudSync() {
  return initialSync({
    getLocalAppointments: () => getAppointmentsList(),
    saveLocalAppointments: (apts) => setJson(STORAGE_KEYS.APPOINTMENTS, apts),
    getLocalDoctors: () => getDoctorsList(),
    saveLocalDoctors: (docs) => setJson(STORAGE_KEYS.DOCTORS, docs),
    getLocalMeta: (key) => {
      if (key === 'nextAppointmentId') return getJson(STORAGE_KEYS.NEXT_APPOINTMENT_ID, 1);
      if (key === 'nextDoctorId') return getJson(STORAGE_KEYS.NEXT_DOCTOR_ID, 1);
      return null;
    },
    saveLocalMeta: (key, value) => {
      if (key === 'nextAppointmentId') setJson(STORAGE_KEYS.NEXT_APPOINTMENT_ID, value);
      if (key === 'nextDoctorId') setJson(STORAGE_KEYS.NEXT_DOCTOR_ID, value);
    },
  });
}

/**
 * Subscribe to real-time Firestore changes.
 * onAppointmentsChange and onDoctorsChange are called whenever another browser/device
 * writes data — use these to re-render the UI.
 * Returns a cleanup function (call it on component unmount).
 */
export function subscribeCloudChanges({ onAppointmentsChange, onDoctorsChange }) {
  if (!FIREBASE_ENABLED) return () => {};
  const unsubApts  = subscribeToAppointments((apts) => {
    // Persist to localStorage so offline reads stay fresh
    setJson(STORAGE_KEYS.APPOINTMENTS, apts);
    if (onAppointmentsChange) onAppointmentsChange(apts);
  });
  const unsubDocs = subscribeToDoctors((docs) => {
    setJson(STORAGE_KEYS.DOCTORS, docs);
    if (onDoctorsChange) onDoctorsChange(docs);
  });
  return () => { unsubApts(); unsubDocs(); };
}

export { FIREBASE_ENABLED };

export function createAppointment(data) {
  const list = getAppointmentsList();
  const { name, phone, email, service, date, time, period, message, notes, status, age, sex, address } = data;
  const duplicate = list.find(
    (apt) =>
      apt.phone === phone &&
      apt.date === date &&
      apt.time === (time || '') &&
      apt.status !== 'cancelled'
  );
  if (duplicate) {
    return Promise.reject({
      response: {
        status: 409,
        data: {
          error:
            'You already have an appointment booked for this date and time. Please choose a different time or contact us to modify your existing appointment.',
          duplicate: true,
          existingAppointmentId: duplicate.id,
        },
      },
    });
  }
  const id = getNextId(STORAGE_KEYS.NEXT_APPOINTMENT_ID);
  const now = new Date().toISOString();
  const appointment = {
    id,
    name: name || '',
    phone: phone || '',
    email: email || '',
    service: service || '',
    date: date || '',
    time: time || '',
    period: period || 'AM',
    dateTime: `${date || ''} ${time || ''} ${period || 'AM'}`,
    message: message || '',
    status: status || 'pending',
    notes: notes || '',
    age: age || '',
    sex: sex || '',
    address: address || '',
    followUpDate: null,
    followUpDays: null,
    createdAt: now,
    updatedAt: now,
  };
  list.push(appointment);
  saveAppointments(list);
  cloudSaveAppointment(appointment); // fire-and-forget cloud sync
  return Promise.resolve({
    success: true,
    message: 'Appointment request received. We will contact you soon.',
    appointmentId: id,
  });
}

export function checkAppointment(phone, date, time) {
  const list = getAppointmentsList();
  const duplicate = list.find(
    (apt) =>
      apt.phone === phone &&
      apt.date === date &&
      (time ? apt.time === time : true) &&
      apt.status !== 'cancelled'
  );
  return Promise.resolve({
    hasExisting: !!duplicate,
    appointment: duplicate || null,
  });
}

export function getAdminAppointments(filters = {}) {
  let list = getAppointmentsList();
  if (filters.status) list = list.filter((a) => a.status === filters.status);
  if (filters.date) list = list.filter((a) => a.date === filters.date);
  list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return Promise.resolve({ success: true, appointments: list });
}

export function getAppointmentById(id) {
  const list = getAppointmentsList();
  const appointment = list.find((a) => a.id === parseInt(id, 10));
  return Promise.resolve(appointment ? { success: true, appointment } : null);
}

export function updateAppointment(id, data) {
  const list = getAppointmentsList();
  const index = list.findIndex((a) => a.id === parseInt(id, 10));
  if (index === -1) return Promise.resolve(null);
  list[index] = {
    ...list[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveAppointments(list);
  cloudSaveAppointment(list[index]); // fire-and-forget cloud sync
  return Promise.resolve({ success: true, appointment: list[index] });
}

export function deleteAppointment(id) {
  const list = getAppointmentsList();
  const index = list.findIndex((a) => a.id === parseInt(id, 10));
  if (index === -1) return Promise.resolve(null);
  list.splice(index, 1);
  saveAppointments(list);
  cloudDeleteAppointment(id); // fire-and-forget cloud sync
  return Promise.resolve({ success: true, message: 'Appointment deleted successfully' });
}

export function getAppointmentStats() {
  const list = getAppointmentsList();
  const stats = {
    total: list.length,
    pending: list.filter((a) => a.status === 'pending').length,
    confirmed: list.filter((a) => a.status === 'confirmed').length,
    cancelled: list.filter((a) => a.status === 'cancelled').length,
    completed: list.filter((a) => a.status === 'completed').length,
  };
  return Promise.resolve({ success: true, stats });
}

/** Follow-up days options (in days) */
export const FOLLOW_UP_DAYS_OPTIONS = [5, 10, 15, 20, 30, 60];

/**
 * Compute follow-up date from a visit date and number of days.
 * @param {string} visitDate - YYYY-MM-DD
 * @param {number} days - e.g. 15
 * @returns {string} YYYY-MM-DD
 */
export function addDaysToDate(visitDate, days) {
  if (!visitDate || days == null || days <= 0) return null;
  const d = new Date(visitDate);
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().slice(0, 10);
}

/**
 * Get appointments whose follow-up date is on the given date.
 * @param {string} date - YYYY-MM-DD
 * @returns {Promise<{ success: boolean, appointments: Array }>}
 */
export function getFollowUpsForDate(date) {
  if (!date) return Promise.resolve({ success: true, appointments: [] });
  const list = getAppointmentsList();
  const normalized = String(date).slice(0, 10);
  const appointments = list.filter(
    (a) => a.followUpDate && String(a.followUpDate).slice(0, 10) === normalized
  );
  appointments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  return Promise.resolve({ success: true, appointments });
}

/**
 * Export appointments to Excel, grouped date-wise.
 * Each date gets its own sheet. Returns a Blob for download.
 */
export function exportAppointmentsToExcel(filters = {}) {
  let list = getAppointmentsList();
  if (filters.status) list = list.filter((a) => a.status === filters.status);
  if (filters.dateFrom) list = list.filter((a) => a.date >= filters.dateFrom);
  if (filters.dateTo) list = list.filter((a) => a.date <= filters.dateTo);

  const grouped = {};
  list.forEach((apt) => {
    const d = apt.date || 'Unknown';
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(apt);
  });

  const header = [
    'ID', 'Name', 'Phone', 'Email', 'Service', 'Date', 'Time', 'Period',
    'Status', 'Notes', 'Message', 'Follow-Up Date', 'Follow-Up Days', 'Created At', 'Updated At',
  ];

  const wb = XLSX.utils.book_new();

  const sortedDates = Object.keys(grouped).sort();

  if (sortedDates.length === 0) {
    // Workbook must have at least one sheet
    const ws = XLSX.utils.aoa_to_sheet([
      header,
      ['', 'No appointments found for the selected period', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, 'Appointments');
  } else {
    sortedDates.forEach((date) => {
      const rows = grouped[date].map((apt) => [
        apt.id,
        apt.name || '',
        apt.phone || '',
        apt.email || '',
        apt.service || '',
        apt.date || '',
        apt.time || '',
        apt.period || 'AM',
        apt.status || '',
        apt.notes || '',
        apt.message || '',
        apt.followUpDate || '',
        apt.followUpDays != null ? apt.followUpDays : '',
        apt.createdAt || '',
        apt.updatedAt || '',
      ]);
      const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
      const sheetName = date.replace(/[/\\*?:\x5B\x5D]/g, '-').slice(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Appointments');
    });
  }

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

/**
 * Trigger download of appointments Excel file (date-wise sheets).
 */
export function downloadAppointmentsExcel(filters = {}) {
  const blob = exportAppointmentsToExcel(filters);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Sattva-appointments-${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Day-wise backup: Export patient data for a single date.
 * @param {string} date - Date in YYYY-MM-DD format
 */
export function downloadDayBackup(date) {
  if (!date) return;
  const filters = { dateFrom: date, dateTo: date };
  const blob = exportAppointmentsToExcel(filters);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Sattva-backup-day-${date}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Month-wise backup: Export patient data for a full month.
 * @param {number} year - e.g. 2026
 * @param {number} month - 1-12
 */
export function downloadMonthBackup(year, month) {
  if (!year || !month) return;
  const dateFrom = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const dateTo = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  const filters = { dateFrom, dateTo };
  const blob = exportAppointmentsToExcel(filters);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Sattva-backup-month-${year}-${String(month).padStart(2, '0')}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

// ----- Full backup & restore (no backend – use when switching browser) -----
const BACKUP_VERSION = 1;

/**
 * Download a full JSON backup (appointments, doctors, IDs). Use this before switching
 * browser or device; then use "Restore from backup" in the new browser to load data.
 */
export function downloadFullBackup() {
  const appointments = getAppointmentsList();
  const doctors = getDoctorsList();
  const nextAppointmentId = getJson(STORAGE_KEYS.NEXT_APPOINTMENT_ID, 1);
  const nextDoctorId = getJson(STORAGE_KEYS.NEXT_DOCTOR_ID, 1);
  const adminCredentials = getJson(STORAGE_KEYS.ADMIN_CREDENTIALS, null);
  const backup = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    appointments,
    doctors,
    nextAppointmentId,
    nextDoctorId,
    adminCredentials,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Sattva-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Restore from a full backup file (e.g. after switching browser). Replaces current
 * appointments, doctors, and IDs with the backup. Admin credentials are restored if present.
 * @param {File} file - JSON file from "Download full backup"
 * @returns {Promise<{ success: boolean, message: string, error?: string }>}
 */
export function restoreFromBackup(file) {
  return new Promise((resolve) => {
    if (!file || !file.name) {
      resolve({ success: false, message: 'No file selected', error: 'no_file' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result;
        if (!text || typeof text !== 'string') {
          resolve({ success: false, message: 'File is empty', error: 'empty' });
          return;
        }
        const data = JSON.parse(text);
        if (!data || typeof data !== 'object') {
          resolve({ success: false, message: 'Invalid backup format', error: 'invalid' });
          return;
        }
        const appointments = Array.isArray(data.appointments) ? data.appointments : [];
        const doctors = Array.isArray(data.doctors) ? data.doctors : null;
        const nextAppointmentId =
          typeof data.nextAppointmentId === 'number' ? data.nextAppointmentId : undefined;
        const nextDoctorId =
          typeof data.nextDoctorId === 'number' ? data.nextDoctorId : undefined;
        const adminCredentials =
          data.adminCredentials && typeof data.adminCredentials === 'object'
            ? data.adminCredentials
            : undefined;

        setJson(STORAGE_KEYS.APPOINTMENTS, appointments);
        if (doctors !== null) setJson(STORAGE_KEYS.DOCTORS, doctors);
        if (nextAppointmentId !== undefined) setJson(STORAGE_KEYS.NEXT_APPOINTMENT_ID, nextAppointmentId);
        if (nextDoctorId !== undefined) setJson(STORAGE_KEYS.NEXT_DOCTOR_ID, nextDoctorId);
        if (adminCredentials !== undefined) setJson(STORAGE_KEYS.ADMIN_CREDENTIALS, adminCredentials);

        // Push restored data to cloud
        cloudBulkSaveAppointments(appointments);
        if (doctors !== null) cloudBulkSaveDoctors(doctors);

        resolve({
          success: true,
          message: `Restored ${appointments.length} appointments${doctors !== null ? ` and ${doctors.length} doctors` : ''}. Reload the page to see changes.`,
        });
      } catch (e) {
        resolve({
          success: false,
          message: 'Invalid or corrupted backup file. Use a JSON file from "Download full backup".',
          error: String(e?.message || e),
        });
      }
    };
    reader.onerror = () => {
      resolve({ success: false, message: 'Failed to read file', error: 'read_error' });
    };
    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Import/restore appointments from an Excel file that was previously exported via
 * downloadAppointmentsExcel / downloadDayBackup / downloadMonthBackup.
 * Merges into existing localStorage data by appointment ID (no duplicates).
 * @param {File} file - .xlsx file
 * @returns {Promise<{ success: boolean, message: string, imported: number, error?: string }>}
 */
export function restoreFromExcel(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve({ success: false, message: 'No file selected', error: 'no_file' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array' });

        const imported = [];

        wb.SheetNames.forEach((sheetName) => {
          const ws = wb.Sheets[sheetName];
          if (!ws) return;
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
          if (rows.length < 2) return;

          // Find header row (first row that contains 'ID' and 'Name')
          let headerRowIdx = -1;
          let headerRow = [];
          for (let r = 0; r < Math.min(rows.length, 5); r++) {
            const row = rows[r].map(String);
            if (row.includes('ID') && row.includes('Name') && row.includes('Phone')) {
              headerRowIdx = r;
              headerRow = row;
              break;
            }
          }
          if (headerRowIdx === -1) return; // Not our format

          const col = (name) => headerRow.indexOf(name);
          const idIdx       = col('ID');
          const nameIdx     = col('Name');
          const phoneIdx    = col('Phone');
          const emailIdx    = col('Email');
          const serviceIdx  = col('Service');
          const dateIdx     = col('Date');
          const timeIdx     = col('Time');
          const periodIdx   = col('Period');
          const statusIdx   = col('Status');
          const notesIdx    = col('Notes');
          const messageIdx  = col('Message');
          const followUpDateIdx  = col('Follow-Up Date');
          const followUpDaysIdx  = col('Follow-Up Days');
          const createdAtIdx     = col('Created At');
          const updatedAtIdx     = col('Updated At');

          for (let i = headerRowIdx + 1; i < rows.length; i++) {
            const row = rows[i];
            const rawId = row[idIdx];
            if (rawId === '' || rawId == null) continue;
            const id = Number(rawId);
            if (!id || isNaN(id)) continue;

            imported.push({
              id,
              name:         String(row[nameIdx]    || ''),
              phone:        String(row[phoneIdx]   || ''),
              email:        String(row[emailIdx]   || ''),
              service:      String(row[serviceIdx] || ''),
              date:         String(row[dateIdx]    || ''),
              time:         String(row[timeIdx]    || ''),
              period:       String(row[periodIdx]  || 'AM'),
              dateTime:     `${row[dateIdx] || ''} ${row[timeIdx] || ''} ${row[periodIdx] || 'AM'}`,
              status:       String(row[statusIdx]  || 'pending'),
              notes:        String(row[notesIdx]   || ''),
              message:      String(row[messageIdx] || ''),
              followUpDate: row[followUpDateIdx] ? String(row[followUpDateIdx]) : null,
              followUpDays: row[followUpDaysIdx] !== '' && row[followUpDaysIdx] != null
                              ? Number(row[followUpDaysIdx]) : null,
              createdAt:    String(row[createdAtIdx] || new Date().toISOString()),
              updatedAt:    String(row[updatedAtIdx] || new Date().toISOString()),
            });
          }
        });

        if (imported.length === 0) {
          resolve({ success: false, message: 'No appointments found in the Excel file. Make sure you upload a file exported from this app.', imported: 0 });
          return;
        }

        // Merge into existing localStorage (by ID)
        const existing = getAppointmentsList();
        const byId = {};
        existing.forEach((a) => { byId[a.id] = a; });
        let newCount = 0;
        let updatedCount = 0;
        imported.forEach((apt) => {
          if (byId[apt.id]) {
            byId[apt.id] = { ...byId[apt.id], ...apt };
            updatedCount++;
          } else {
            byId[apt.id] = apt;
            newCount++;
          }
        });
        const merged = Object.values(byId).sort((a, b) => a.id - b.id);
        saveAppointments(merged);

        // Keep next ID ahead of max
        const maxId = Math.max(...merged.map((a) => a.id), 0);
        const currentNext = getJson(STORAGE_KEYS.NEXT_APPOINTMENT_ID, 1);
        if (maxId >= currentNext) {
          setJson(STORAGE_KEYS.NEXT_APPOINTMENT_ID, maxId + 1);
        }

        cloudBulkSaveAppointments(merged); // push to cloud after Excel import

        resolve({
          success: true,
          message: `Excel imported: ${newCount} new + ${updatedCount} updated appointments. Reloading…`,
          imported: imported.length,
        });
      } catch (err) {
        resolve({
          success: false,
          message: 'Failed to parse Excel file. Make sure you upload a valid .xlsx exported from this app.',
          error: String(err?.message || err),
          imported: 0,
        });
      }
    };
    reader.onerror = () => {
      resolve({ success: false, message: 'Failed to read file', error: 'read_error', imported: 0 });
    };
    reader.readAsArrayBuffer(file);
  });
}

// ----- Auth (local only: no backend) -----
function getAdminCredentials() {
  const stored = getJson(STORAGE_KEYS.ADMIN_CREDENTIALS, null);
  return stored || DEFAULT_ADMIN;
}

export function authLogin(username, password) {
  const { username: u, password: p } = getAdminCredentials();
  if (username !== u || password !== p) {
    return Promise.reject({
      response: { data: { error: 'Invalid credentials' }, status: 401 },
    });
  }
  const token = LOCAL_ADMIN_TOKEN + '_' + Date.now();
  localStorage.setItem('token', token);
  return Promise.resolve({
    success: true,
    token,
    user: { username: u, role: 'admin' },
  });
}

export function authVerify(token) {
  if (!token || !String(token).startsWith(LOCAL_ADMIN_TOKEN)) {
    return Promise.reject({ response: { status: 401 } });
  }
  const { username } = getAdminCredentials();
  return Promise.resolve({
    valid: true,
    user: { username, role: 'admin' },
  });
}
