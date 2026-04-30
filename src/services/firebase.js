/**
 * Firebase configuration for Sattva Clinic
 *
 * HOW TO SET UP (one-time, ~5 minutes):
 * 1. Go to https://console.firebase.google.com
 * 2. Click "Add project" → name it "sattva-clinic" → disable Analytics → Create
 * 3. In the project dashboard, click the </> (Web) icon → register app as "sattva-web"
 * 4. Copy the firebaseConfig values shown and paste them in .env (see .env.example)
 * 5. In left sidebar → Build → Firestore Database → Create database
 *    → Start in "production mode" → choose Asia-south1 (Mumbai) region → Enable
 * 6. In Firestore → Rules tab → replace with:
 *
 *      rules_version = '2';
 *      service cloud.firestore {
 *        match /databases/{database}/documents {
 *          match /{document=**} {
 *            allow read, write: if request.auth == null;
 *          }
 *        }
 *      }
 *
 *    (This allows all reads/writes. The data is already encrypted with AES before storing.)
 *    Then click "Publish".
 *
 * After setting REACT_APP_FIREBASE_* variables in .env and restarting the dev server,
 * all appointments and doctors will automatically sync to Firestore in real-time.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
};

// Check if Firebase is configured
export const FIREBASE_ENABLED =
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'undefined';

let db = null;

if (FIREBASE_ENABLED) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);

    // Enable offline persistence (data available even without internet)
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open — only one tab can use offline persistence at a time
        console.warn('[Sattva Firebase] Offline persistence unavailable: multiple tabs open');
      } else if (err.code === 'unimplemented') {
        console.warn('[Sattva Firebase] Offline persistence not supported in this browser');
      }
    });

    console.log('[Sattva Firebase] ✅ Connected to Firestore — data will sync across all browsers/devices');
  } catch (e) {
    console.error('[Sattva Firebase] ❌ Failed to initialize:', e.message);
  }
} else {
  console.info(
    '[Sattva Firebase] ℹ️  Firebase not configured. Data is stored in localStorage only.\n' +
    'To enable cross-browser sync, add REACT_APP_FIREBASE_* variables to .env'
  );
}

export { db };
