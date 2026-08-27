export interface CellPrediction {
  row: number; // 0 (bottom) to 9 (top)
  col: number; // 0 to 4
  mIndex: number; // 1 to 50
  mKey: string; // "m1" .. "m50"
  isSafe: boolean; // true ("1") or false ("0")
  value: "1" | "0";
}

export type FirebaseM11Structure = {
  m11: Record<string, Record<string, "1" | "0">>;
};

export interface RowDifficultyInfo {
  row: number;
  mult: string;
  safeCount: number;
  badCount: number;
}
