import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAVUQQMS2pvCfmmr8F0nfmEbXH1UhFZNYQ",
  authDomain: "swtyyyy-6ca13.firebaseapp.com",
  databaseURL: "https://swtyyyy-6ca13-default-rtdb.firebaseio.com",
  projectId: "swtyyyy-6ca13",
  storageBucket: "swtyyyy-6ca13.firebasestorage.app",
  messagingSenderId: "1094753151167",
  appId: "1:1094753151167:web:19f0a686a7401612abfe0a",
  measurementId: "G-HN3JJYZSEE"
};

// Initialize Firebase App safely (singleton)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const rtdb = getDatabase(app);

/**
 * Saves generated prediction data to Firebase Realtime Database under path /m11
 */
export const savePredictionsToFirebase = async (predictionsObject: Record<string, Record<string, '1' | '0'>>) => {
  try {
    const m11Ref = ref(rtdb, 'm11');
    await set(m11Ref, predictionsObject);
    return { success: true };
  } catch (error) {
    console.error("Error saving predictions to Firebase /m11:", error);
    return { success: false, error };
  }
};

/**
 * Reads existing prediction data from Firebase Realtime Database under path /m11
 */
export const fetchPredictionsFromFirebase = async () => {
  try {
    const m11Ref = ref(rtdb, 'm11');
    const snapshot = await get(m11Ref);
    if (snapshot.exists()) {
      return { success: true, data: snapshot.val() };
    }
    return { success: false, data: null };
  } catch (error) {
    console.error("Error fetching predictions from Firebase /m11:", error);
    return { success: false, error };
  }
};

/**
 * Realtime listener for /m11 path in Firebase
 */
export const subscribeToFirebasePredictions = (callback: (data: Record<string, any> | null) => void) => {
  try {
    const m11Ref = ref(rtdb, 'm11');
    return onValue(m11Ref, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback(null);
      }
    });
  } catch (err) {
    console.error("Error in Firebase subscription:", err);
    return () => {};
  }
};
