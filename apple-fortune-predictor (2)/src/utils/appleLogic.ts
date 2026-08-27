import { FirebaseM11Structure, RowDifficultyInfo } from '../types';

/**
 * Rows ordered from top (Row 9, highest multiplier) to bottom (Row 0, lowest multiplier)
 */
export const TARGET_ROWS: RowDifficultyInfo[] = [
  { mult: '349.68', row: 9, safeCount: 1, badCount: 4 }, // أعلى صف
  { mult: '69.93', row: 8, safeCount: 2, badCount: 3 },
  { mult: '27.97', row: 7, safeCount: 2, badCount: 3 },
  { mult: '11.18', row: 6, safeCount: 3, badCount: 2 },
  { mult: '6.71', row: 5, safeCount: 3, badCount: 2 },
  { mult: '4.02', row: 4, safeCount: 3, badCount: 2 },
  { mult: '2.41', row: 3, safeCount: 4, badCount: 1 },
  { mult: '1.93', row: 2, safeCount: 4, badCount: 1 },
  { mult: '1.54', row: 1, safeCount: 4, badCount: 1 },
  { mult: '1.23', row: 0, safeCount: 4, badCount: 1 }, // أسفل صف يبدأ منه اللاعب
];

/**
 * Calculates mIndex (1 to 50) from 0-based row and col
 * Formula: row * 5 + col + 1
 */
export const calculateMIndex = (row: number, col: number): number => {
  return row * 5 + col + 1;
};

/**
 * Generates prediction dataset conforming to the user's Firebase RTDB 'm11' schema
 * and row-specific probability distribution
 */
export const generateFirebasePredictions = (): {
  predictions: Record<string, Record<string, '1' | '0'>>;
  fullFirebaseData: FirebaseM11Structure;
  safeIndices: number[];
} => {
  const finalObject: Record<string, Record<string, '1' | '0'>> = {};
  const safeIndices: number[] = [];

  // Iterate over 10 rows (from 0 bottom to 9 top)
  for (let r = 0; r < 10; r++) {
    // Determine safe count based on row
    let safeCount = 4;
    if (r >= 4 && r < 7) safeCount = 3; // Rows 4, 5, 6
    if (r >= 7 && r < 9) safeCount = 2; // Rows 7, 8
    if (r >= 9) safeCount = 1; // Row 9

    // Randomly pick safe columns among the 5 columns (0 to 4)
    const safeCols: number[] = [];
    while (safeCols.length < safeCount) {
      const randomCol = Math.floor(Math.random() * 5);
      if (!safeCols.includes(randomCol)) {
        safeCols.push(randomCol);
      }
    }

    // Assign values for each cell in row r
    for (let c = 0; c < 5; c++) {
      const mIndex = calculateMIndex(r, c);
      const isSafe = safeCols.includes(c);
      const value: '1' | '0' = isSafe ? '1' : '0';
      const mKey = `m${mIndex}`;

      if (isSafe) {
        safeIndices.push(mIndex);
      }

      // Structure required by Firebase RTDB under /m11
      finalObject[mKey] = { [mKey]: value };
    }
  }

  return {
    predictions: finalObject,
    fullFirebaseData: { m11: finalObject },
    safeIndices,
  };
};

/**
 * Helper to check if a specific cell has a safe apple from predictions object
 */
export const isSafeApple = (
  predictions: Record<string, any> | null | undefined,
  rowIdx: number,
  colIdx: number
): boolean => {
  if (!predictions || Object.keys(predictions).length === 0) return false;

  // 1. Calculate sequential cell number (1 to 50)
  const mIndex = calculateMIndex(rowIdx, colIdx);
  const mKey = `m${mIndex}`;

  // 2. Read cell object from predictions
  const mObj = predictions[mKey];

  // 3. Verify that value equals "1" (Safe)
  if (mObj && typeof mObj === 'object' && mObj[mKey] === '1') {
    return true; // التفاحة سليمة!
  }

  return false; // التفاحة تالفة (0)
};

/**
 * High quality image sources with fallback support
 */
export const APPLE_IMAGES = {
  goodApple:
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_EBaWH-ms57-BD9Xe_0veuqrhVQJvqNxnIMKcv67PsR7Vh_h2Sz0RXDDvh0y9XCHZloFGTa48tfX0fvyb5BTDXfDd0CvEk6dj9o8Hb3HQ-j-jvGWSEQ6SOVrwjioXIBortqLfV5ea2RPjl5HyQoPElcJh5GRkTVKV4-iGifos4mdxwaM1DHKmJpeGLmgp/s178/1000007982.png',
  badApple:
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEizvKTxsM8t7GBAxV6eAyQsA29MRz3M56cjNHs0QwbVJtbxkjvJV-cA1B63zqC35y5x-XxWKLpCoiWsOTh_YsB2I7Rqriuu1H7pKD6DjNhDEdLo52X9eEe0kIpkVkDc0bgF1ktB1PMkYXzurh1tTvtCI1a0vF75YUXrCv8Cvoz7iHA_HWt1qL8gH3BmILRQ/s180/1000007983.png',
  hiddenApple:
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjXhuh5qTBUaSpGa6FjuiX3__AriHF9X4pANjNd9H3aAzic0Aeu0km0skdYCAhi5i5gqeYpQI_V5vbUSxrbK6_KhZN7pu0MnFdTEfbn3OSQaZoZBZ3JrTiUcB4pHSzP_MqZjJdMro7WTrGmY_MvVXXivdQs5rq-PetPJLN8uQt13SLS1-SJ-xCEN5S0GnPz/s180/1000007981.png',
};
