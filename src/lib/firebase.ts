/* ==========================================================================
   FIREBASE FIRESTORE INTEGRATION FOR JAMIE'S LERNPLATTFORM
   Provides real-time cloud sync across Mac, iPad, iPhone etc.
   ========================================================================== */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, type Firestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyA7wPqyt7qM-3eG0TG6GcHWNaCI6uitc9M",
  authDomain: "jamies-lernplattform.firebaseapp.com",
  projectId: "jamies-lernplattform",
  storageBucket: "jamies-lernplattform.firebasestorage.app",
  messagingSenderId: "995621541247",
  appId: "1:995621541247:web:e7fc9002f5b5a722d8764a"
};

// Initialize Firebase only in browser or safe environment
const app = typeof window !== 'undefined'
  ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig))
  : null;

export const db: Firestore | null = app ? getFirestore(app) : null;

const COLLECTION_NAME = 'jamie_data';
const DOC_ID = 'progress';

export const FirebaseSync = {
  isAvailable(): boolean {
    return typeof window !== 'undefined' && db !== null;
  },

  /**
   * Save all progress to Firestore
   */
  async save(data: any): Promise<boolean> {
    if (!this.isAvailable() || !db) return false;
    try {
      const ref = doc(db, COLLECTION_NAME, DOC_ID);
      await setDoc(ref, {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn('Firebase save warning (evtl. noch keine Firestore-Datenbank angelegt oder Offline):', err);
      return false;
    }
  },

  /**
   * Load progress once from Firestore
   */
  async load(): Promise<any | null> {
    if (!this.isAvailable() || !db) return null;
    try {
      const ref = doc(db, COLLECTION_NAME, DOC_ID);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data();
      }
      return null;
    } catch (err) {
      console.warn('Firebase load error:', err);
      return null;
    }
  },

  /**
   * Listen for real-time changes across all open devices (iPad, Mac, Handy)
   */
  subscribe(onRemoteUpdate: (data: any) => void): (() => void) | null {
    if (!this.isAvailable() || !db) return null;
    try {
      const ref = doc(db, COLLECTION_NAME, DOC_ID);
      const unsubscribe = onSnapshot(ref, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          onRemoteUpdate(data);
        }
      }, (err) => {
        console.warn('Firebase realtime listener warning:', err);
      });
      return unsubscribe;
    } catch (e) {
      console.warn('Could not subscribe to Firebase:', e);
      return null;
    }
  }
};
