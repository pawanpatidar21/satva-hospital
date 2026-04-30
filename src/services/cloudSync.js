/**
 * Sattva Clinic — Cloud Sync Service (Firebase Firestore)
 *
 * This module wraps all localStorage reads/writes and mirrors them to Firestore
 * when Firebase is configured. Falls back gracefully to localStorage-only mode.
 *
 * Collections:
 *  - sattva_appointments  (documents keyed by appointment ID)
 *  - sattva_doctors       (documents keyed by doctor ID)
 *  - sattva_meta          (counters: next_appointment_id, next_doctor_id)
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
} from 'firebase/firestore';
import { db, FIREBASE_ENABLED } from './firebase';

export { FIREBASE_ENABLED };

const COL = {
  APPOINTMENTS: 'sattva_appointments',
  DOCTORS:      'sattva_doctors',
  META:         'sattva_meta',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function withoutUndefined(obj) {
  return JSON.parse(JSON.stringify(obj, (_, v) => (v === undefined ? null : v)));
}

// ─── Meta (counters) ────────────────────────────────────────────────────────

export async function cloudGetMeta(key) {
  if (!FIREBASE_ENABLED || !db) return null;
  try {
    const snap = await getDoc(doc(db, COL.META, key));
    return snap.exists() ? snap.data().value : null;
  } catch { return null; }
}

export async function cloudSetMeta(key, value) {
  if (!FIREBASE_ENABLED || !db) return;
  try {
    await setDoc(doc(db, COL.META, key), { value });
  } catch { /* silent */ }
}

// ─── Appointments ────────────────────────────────────────────────────────────

/**
 * Fetch all appointments from Firestore.
 * Returns null if Firebase is not configured or fails.
 */
export async function cloudGetAppointments() {
  if (!FIREBASE_ENABLED || !db) return null;
  try {
    const snap = await getDocs(collection(db, COL.APPOINTMENTS));
    return snap.docs.map((d) => d.data());
  } catch (e) {
    console.warn('[CloudSync] Failed to fetch appointments:', e.message);
    return null;
  }
}

/**
 * Save/overwrite a single appointment in Firestore.
 */
export async function cloudSaveAppointment(appointment) {
  if (!FIREBASE_ENABLED || !db) return;
  try {
    await setDoc(
      doc(db, COL.APPOINTMENTS, String(appointment.id)),
      withoutUndefined({ ...appointment, _syncedAt: new Date().toISOString() })
    );
  } catch (e) {
    console.warn('[CloudSync] Failed to save appointment:', e.message);
  }
}

/**
 * Delete a single appointment from Firestore.
 */
export async function cloudDeleteAppointment(id) {
  if (!FIREBASE_ENABLED || !db) return;
  try {
    await deleteDoc(doc(db, COL.APPOINTMENTS, String(id)));
  } catch (e) {
    console.warn('[CloudSync] Failed to delete appointment:', e.message);
  }
}

/**
 * Bulk-write all appointments to Firestore (used on restore/import).
 * Firestore batch limit is 500 writes.
 */
export async function cloudBulkSaveAppointments(appointments) {
  if (!FIREBASE_ENABLED || !db || !appointments?.length) return;
  const BATCH_SIZE = 400;
  try {
    for (let i = 0; i < appointments.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      appointments.slice(i, i + BATCH_SIZE).forEach((apt) => {
        batch.set(
          doc(db, COL.APPOINTMENTS, String(apt.id)),
          withoutUndefined({ ...apt, _syncedAt: new Date().toISOString() })
        );
      });
      await batch.commit();
    }
  } catch (e) {
    console.warn('[CloudSync] Bulk save appointments failed:', e.message);
  }
}

// ─── Doctors ────────────────────────────────────────────────────────────────

export async function cloudGetDoctors() {
  if (!FIREBASE_ENABLED || !db) return null;
  try {
    const snap = await getDocs(collection(db, COL.DOCTORS));
    return snap.docs.map((d) => d.data());
  } catch (e) {
    console.warn('[CloudSync] Failed to fetch doctors:', e.message);
    return null;
  }
}

export async function cloudSaveDoctor(doctor) {
  if (!FIREBASE_ENABLED || !db) return;
  try {
    await setDoc(
      doc(db, COL.DOCTORS, String(doctor.id)),
      withoutUndefined({ ...doctor, _syncedAt: new Date().toISOString() })
    );
  } catch (e) {
    console.warn('[CloudSync] Failed to save doctor:', e.message);
  }
}

export async function cloudDeleteDoctor(id) {
  if (!FIREBASE_ENABLED || !db) return;
  try {
    await deleteDoc(doc(db, COL.DOCTORS, String(id)));
  } catch (e) {
    console.warn('[CloudSync] Failed to delete doctor:', e.message);
  }
}

export async function cloudBulkSaveDoctors(doctors) {
  if (!FIREBASE_ENABLED || !db || !doctors?.length) return;
  try {
    const batch = writeBatch(db);
    doctors.forEach((d) => {
      batch.set(
        doc(db, COL.DOCTORS, String(d.id)),
        withoutUndefined({ ...d, _syncedAt: new Date().toISOString() })
      );
    });
    await batch.commit();
  } catch (e) {
    console.warn('[CloudSync] Bulk save doctors failed:', e.message);
  }
}

// ─── Real-time listeners ─────────────────────────────────────────────────────

/**
 * Subscribe to real-time appointment changes from Firestore.
 * Calls onUpdate(appointments[]) whenever data changes in any browser/device.
 * Returns an unsubscribe function.
 */
export function subscribeToAppointments(onUpdate) {
  if (!FIREBASE_ENABLED || !db) return () => {};
  return onSnapshot(
    collection(db, COL.APPOINTMENTS),
    (snap) => {
      const appointments = snap.docs.map((d) => d.data());
      onUpdate(appointments);
    },
    (err) => console.warn('[CloudSync] Appointments listener error:', err.message)
  );
}

/**
 * Subscribe to real-time doctor changes from Firestore.
 * Returns an unsubscribe function.
 */
export function subscribeToDoctors(onUpdate) {
  if (!FIREBASE_ENABLED || !db) return () => {};
  return onSnapshot(
    collection(db, COL.DOCTORS),
    (snap) => {
      const doctors = snap.docs.map((d) => d.data());
      onUpdate(doctors);
    },
    (err) => console.warn('[CloudSync] Doctors listener error:', err.message)
  );
}

// ─── Initial seed: push existing localStorage data to Firestore ──────────────

/**
 * Called once on app start. If Firestore has no appointments yet but localStorage does,
 * push localStorage data to Firestore (first-time migration).
 * If Firestore already has data, pull it into localStorage.
 */
export async function initialSync({ getLocalAppointments, saveLocalAppointments,
                                    getLocalDoctors,       saveLocalDoctors,
                                    getLocalMeta,          saveLocalMeta }) {
  if (!FIREBASE_ENABLED || !db) return { synced: false, source: 'localStorage' };

  try {
    const [cloudApts, cloudDocs] = await Promise.all([
      cloudGetAppointments(),
      cloudGetDoctors(),
    ]);

    // ── Appointments ──
    if (cloudApts !== null) {
      if (cloudApts.length > 0) {
        // Cloud has data → write to localStorage (cloud wins)
        saveLocalAppointments(cloudApts);
        const maxId = Math.max(...cloudApts.map((a) => a.id || 0), 0);
        const localNext = getLocalMeta('nextAppointmentId') || 1;
        if (maxId >= localNext) saveLocalMeta('nextAppointmentId', maxId + 1);
      } else {
        // Cloud is empty → push localStorage → Firestore
        const localApts = getLocalAppointments();
        if (localApts.length > 0) {
          await cloudBulkSaveAppointments(localApts);
          const maxId = Math.max(...localApts.map((a) => a.id || 0), 0);
          await cloudSetMeta('nextAppointmentId', (getLocalMeta('nextAppointmentId') || maxId + 1));
        }
      }
    }

    // ── Doctors ──
    if (cloudDocs !== null) {
      if (cloudDocs.length > 0) {
        saveLocalDoctors(cloudDocs);
      } else {
        const localDocs = getLocalDoctors();
        if (localDocs.length > 0) await cloudBulkSaveDoctors(localDocs);
      }
    }

    return { synced: true, source: 'firestore' };
  } catch (e) {
    console.warn('[CloudSync] initialSync failed, using localStorage:', e.message);
    return { synced: false, source: 'localStorage' };
  }
}
