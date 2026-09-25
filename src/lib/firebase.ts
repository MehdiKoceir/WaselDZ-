import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely
export const firebaseApp = !getApps().length 
  ? initializeApp(firebaseConfig) 
  : getApp();

// Initialize Firestore with specific database ID if provided
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId)
  : getFirestore(firebaseApp);

// Initialize Authentication
export const auth = getAuth(firebaseApp);

/**
 * Validate live connection to Cloud Firestore server
 */
export async function testFirestoreConnection(): Promise<{ connected: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    // Attempt reading from the server directly to verify network & security rules
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { connected: true, latencyMs: Date.now() - start };
  } catch (error: any) {
    // If the doc doesn't exist, getDocFromServer still succeeds and returns a non-existent DocumentSnapshot
    // Only real connection/permission errors throw
    if (error?.code === 'unavailable' || error?.message?.includes('the client is offline')) {
      return { connected: false, latencyMs: Date.now() - start, error: 'Serveur indisponible ou hors-ligne' };
    }
    // Any other read response from server confirms server connectivity
    return { connected: true, latencyMs: Date.now() - start };
  }
}

/**
 * Ensure an authenticated session exists (anonymous or credentials)
 */
export async function ensureAuthenticatedUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          resolve(cred.user);
        } catch (err) {
          console.warn('Anonymous auth fallback:', err);
          resolve(null);
        }
      }
    });
  });
}
