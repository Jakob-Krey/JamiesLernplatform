/* ==========================================================================
   FIREBASE FIRESTORE INTEGRATION FOR JAMIE'S LERNPLATTFORM
   Provides real-time cloud sync across Mac, iPad, iPhone etc.
   ========================================================================== */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, writeBatch, arrayUnion, arrayRemove, type Firestore } from 'firebase/firestore';
import { currentProfile } from './profile';

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
/** Cloud-Datensatz des aktuellen Kindes (Jamie: 'progress', Maya: 'progress_maya'). */
const ownDocId = () => currentProfile().docId;

export const FirebaseSync = {
  isAvailable(): boolean {
    return typeof window !== 'undefined' && db !== null;
  },

  /**
   * Save all progress to Firestore
   */
  async save(data: any, docId: string = ownDocId()): Promise<boolean> {
    if (!this.isAvailable() || !db) return false;
    try {
      const ref = doc(db, COLLECTION_NAME, docId);
      await setDoc(ref, {
        ...data,
        // gleicher Zeitstempel wie lastUpdated, damit das eigene Echo nicht als "neuer" gilt
        updatedAt: data?.lastUpdated ?? new Date().toISOString()
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
  async load(docId: string = ownDocId()): Promise<any | null> {
    if (!this.isAvailable() || !db) return null;
    try {
      const ref = doc(db, COLLECTION_NAME, docId);
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
   * Eine Karte verschenken: aus dem Dokument des Gebers entfernen und beim Empfänger hinzufügen,
   * in einem Schritt (entweder beides oder nichts).
   */
  async giftCard(fromDocId: string, toDocId: string, cardId: string, ts: string): Promise<boolean> {
    if (!this.isAvailable() || !db) return false;
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, COLLECTION_NAME, fromDocId), {
        unlockedPokemon: arrayRemove(cardId),
        removedPokemon: arrayUnion(cardId),
        lastUpdated: ts,
        updatedAt: ts
      }, { merge: true });
      batch.set(doc(db, COLLECTION_NAME, toDocId), {
        unlockedPokemon: arrayUnion(cardId),
        removedPokemon: arrayRemove(cardId),
        lastUpdated: ts,
        updatedAt: ts
      }, { merge: true });
      await batch.commit();
      return true;
    } catch (err) {
      console.warn('Firebase gift error:', err);
      return false;
    }
  },

  /**
   * Wie load(), unterscheidet aber "Dokument existiert nicht" (ok, data=null) von einem Fehler (ok=false).
   */
  async loadChecked(docId: string = ownDocId()): Promise<{ ok: boolean; data: any | null }> {
    if (!this.isAvailable() || !db) return { ok: false, data: null };
    try {
      const snap = await getDoc(doc(db, COLLECTION_NAME, docId));
      return { ok: true, data: snap.exists() ? snap.data() : null };
    } catch (err) {
      console.warn('Firebase load error:', err);
      return { ok: false, data: null };
    }
  },

  /**
   * Listen for real-time changes across all open devices (iPad, Mac, Handy)
   */
  subscribe(onRemoteUpdate: (data: any) => void, docId: string = ownDocId()): (() => void) | null {
    if (!this.isAvailable() || !db) return null;
    try {
      const ref = doc(db, COLLECTION_NAME, docId);
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

if (typeof window !== 'undefined') (window as any).FirebaseSync = FirebaseSync;
