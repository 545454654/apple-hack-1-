export interface FirebaseConfigType {
  apiKey?: string;
  authDomain?: string;
  databaseURL?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export type AppPhase = 'splash' | 'loading' | 'login' | 'dashboard';

export interface PredictionCell {
  [key: string]: string; // e.g. { "m1": "1" }
}

export interface PredictionsType {
  [key: string]: PredictionCell; // e.g. { "m1": { "m1": "1" } }
}

export interface RowConfig {
  mult: string;
  row: number;
}
