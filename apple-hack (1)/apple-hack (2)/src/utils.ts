import { PredictionsType } from './types';

/**
 * Generates predictions exactly as specified in the game difficulty rules:
 * - Rows 0 to 3 (Bottom 4 rows): 4 safe apples, 1 bad apple
 * - Rows 4 to 6 (Middle 3 rows): 3 safe apples, 2 bad apples
 * - Rows 7 & 8 (Advanced rows): 2 safe apples, 3 bad apples
 * - Row 9 (Top row): 1 safe apple, 4 bad apples
 */
export const generatePredictionsLocal = (): PredictionsType => {
  const finalObject: Record<string, any> = {};

  for (let r = 0; r < 10; r++) {
    let safeCount = 4;
    if (r >= 4 && r < 7) safeCount = 3;      // Rows 4, 5, 6
    if (r >= 7 && r < 9) safeCount = 2;      // Rows 7, 8
    if (r >= 9) safeCount = 1;               // Row 9 (Top)

    const safeCols: number[] = [];
    while (safeCols.length < safeCount) {
      const randomCol = Math.floor(Math.random() * 5);
      if (!safeCols.includes(randomCol)) {
        safeCols.push(randomCol);
      }
    }

    for (let c = 0; c < 5; c++) {
      const mIndex = r * 5 + c + 1; // Magic formula: row * 5 + col + 1
      const value = safeCols.includes(c) ? "1" : "0"; // 1 = Safe, 0 = Bad
      
      finalObject[`m${mIndex}`] = { [`m${mIndex}`]: value };
    }
  }

  return finalObject as PredictionsType;
};

/**
 * Verifies if an apple is safe at coordinates (row, col) using the predictions object
 * as specified in Section 3 of the instructions.
 */
export const isSafeApple = (predictions: PredictionsType | null, rowIdx: number, colIdx: number): boolean => {
  if (!predictions || Object.keys(predictions).length === 0) return false;
  
  // 1. Calculate unique index (1 to 50)
  const mIndex = rowIdx * 5 + colIdx + 1;
  const mKey = `m${mIndex}`;
  
  // 2. Read nested object matching the index
  const mObj = (predictions as any)[mKey];
  
  // 3. Verify value is "1"
  if (mObj && typeof mObj === 'object' && mObj[mKey] === "1") {
    return true; // Safe apple!
  }
  
  return false; // Bad apple
};

/**
 * Uploads predictions to Firebase Realtime Database if configured
 */
export const uploadPredictionsToFirebase = async (
  firebaseConfig: any,
  predictions: PredictionsType
): Promise<boolean> => {
  try {
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getDatabase, ref, set } = await import("firebase/database");

    let app;
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    const rtdb = getDatabase(app);
    const rRef = ref(rtdb, 'm11');
    await set(rRef, predictions);
    return true;
  } catch (error) {
    console.error("Firebase RTDB Write Error:", error);
    throw error;
  }
};

/**
 * Fetches predictions from Firebase Realtime Database
 */
export const fetchPredictionsFromFirebase = async (
  firebaseConfig: any
): Promise<PredictionsType | null> => {
  try {
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getDatabase, ref, get } = await import("firebase/database");

    let app;
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    const rtdb = getDatabase(app);
    const rRef = ref(rtdb, 'm11');
    const snapshot = await get(rRef);
    if (snapshot.exists()) {
      return snapshot.val() as PredictionsType;
    }
    return null;
  } catch (error) {
    console.error("Firebase RTDB Read Error:", error);
    throw error;
  }
};
