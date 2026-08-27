/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NetworkBackground } from './components/NetworkBackground';
import { HeaderPills } from './components/HeaderPills';
import { AppleGrid } from './components/AppleGrid';
import { LoadingList, LoadingStep } from './components/LoadingList';
import { LoginPage } from './components/LoginPage';
import { LoadingPage } from './components/LoadingPage';
import { generateFirebasePredictions } from './utils/appleLogic';
import { savePredictionsToFirebase, fetchPredictionsFromFirebase, subscribeToFirebasePredictions } from './utils/firebase';
import { ShieldCheck, Check, Database, KeyRound, Sparkles, LogOut } from 'lucide-react';

const INITIAL_LOADING_STEPS: LoadingStep[] = [
  {
    id: 'connect',
    title: 'الاتصال بقاعدة بيانات Firebase RTDB',
    detail: 'https://swtyyyy-6ca13-default-rtdb.firebaseio.com',
    status: 'pending',
  },
  {
    id: 'generate',
    title: 'توليد مصفوفة الأمان 10×5 وتوزيع الصعوبة',
    detail: 'تحديد مسار التفاح الآمن والتالف من الصف 0 إلى 9 لمنصة Greenbet',
    status: 'pending',
  },
  {
    id: 'structure',
    title: 'هيكلة الأجسام المتداخلة (m1 إلى M50)',
    detail: 'حساب الإحداثيات عبر معادلة (row × 5 + col + 1)',
    status: 'pending',
  },
  {
    id: 'sync',
    title: 'رفع ومزامنة البيانات مع السيرفر السحابي',
    detail: 'تأكيد وحفظ بيانات التوقعات بنجاح',
    status: 'pending',
  },
  {
    id: 'ready',
    title: 'تحديث اللوحة وجاهزية الاستخدام',
    detail: 'تم تفعيل سكربت Apple Hack بنجاح',
    status: 'pending',
  },
];

export default function App() {
  // App Phase State: 'login' | 'loading' | 'authenticated'
  const [appState, setAppState] = useState<'login' | 'loading' | 'authenticated'>('login');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [hackPassword, setHackPassword] = useState<string>('R99');

  const [predictions, setPredictions] = useState<Record<string, Record<string, '1' | '0'>> | null>(null);
  const [hasRevealed, setHasRevealed] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [showCheck, setShowCheck] = useState<boolean>(false);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  
  // Refresh loading list state
  const [showLoadingList, setShowLoadingList] = useState<boolean>(false);
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>(INITIAL_LOADING_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [firebaseStatus, setFirebaseStatus] = useState<'connected' | 'syncing' | 'idle'>('connected');

  // Check saved session
  useEffect(() => {
    const savedUser = localStorage.getItem('lafasoo_user');
    const savedPass = localStorage.getItem('lafasoo_pass');
    if (savedUser && savedPass === 'R99') {
      setCurrentUser(savedUser);
      setHackPassword(savedPass);
      setAppState('authenticated');
    }
  }, []);

  // Listen to live Firebase updates on /m11 path
  useEffect(() => {
    if (appState !== 'authenticated') return;

    // Initial fetch from Firebase if available
    const initData = async () => {
      const res = await fetchPredictionsFromFirebase();
      if (res.success && res.data) {
        setPredictions(res.data);
      } else {
        handleRefreshPredictions(false);
      }
    };
    initData();

    // Realtime subscription to /m11
    const unsubscribe = subscribeToFirebasePredictions((liveData) => {
      if (liveData) {
        setPredictions(liveData);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [appState]);

  // Handle successful login
  const handleLoginSuccess = (user: string, pass: string) => {
    setCurrentUser(user);
    setHackPassword(pass);
    localStorage.setItem('lafasoo_user', user);
    localStorage.setItem('lafasoo_pass', pass);
    setAppState('loading');
  };

  // Handle loading page completion
  const handleLoadingComplete = () => {
    setAppState('authenticated');
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('lafasoo_user');
    localStorage.removeItem('lafasoo_pass');
    setCurrentUser('');
    setAppState('login');
  };

  const handleRefreshPredictions = async (isUserTriggered: boolean = true) => {
    if (isUserTriggered) {
      setIsFlipping(true);
      setLoading(true);
      setShowLoadingList(true);
      setFirebaseStatus('syncing');
      setTimeout(() => setIsFlipping(false), 600);
    }

    // Step 1: Connecting to Firebase
    setLoadingSteps((prev) =>
      prev.map((s, idx) => ({
        ...s,
        status: idx === 0 ? 'loading' : 'pending',
      }))
    );
    setCurrentStepIndex(0);

    if (isUserTriggered) {
      await new Promise((r) => setTimeout(r, 200));
    }

    // Step 2: Generating Matrix (10x5, difficulty scaled)
    setLoadingSteps((prev) =>
      prev.map((s, idx) => ({
        ...s,
        status: idx === 0 ? 'completed' : idx === 1 ? 'loading' : 'pending',
      }))
    );
    setCurrentStepIndex(1);

    const generated = generateFirebasePredictions();

    if (isUserTriggered) {
      await new Promise((r) => setTimeout(r, 220));
    }

    // Step 3: Structuring Nested Objects (m1 to M50)
    setLoadingSteps((prev) =>
      prev.map((s, idx) => ({
        ...s,
        status: idx <= 1 ? 'completed' : idx === 2 ? 'loading' : 'pending',
      }))
    );
    setCurrentStepIndex(2);

    if (isUserTriggered) {
      await new Promise((r) => setTimeout(r, 200));
    }

    // Step 4: Syncing to Firebase RTDB at /m11
    setLoadingSteps((prev) =>
      prev.map((s, idx) => ({
        ...s,
        status: idx <= 2 ? 'completed' : idx === 3 ? 'loading' : 'pending',
      }))
    );
    setCurrentStepIndex(3);

    // Write to Firebase Realtime Database
    await savePredictionsToFirebase(generated.predictions);

    if (isUserTriggered) {
      await new Promise((r) => setTimeout(r, 250));
    }

    // Step 5: Final Ready State
    setLoadingSteps((prev) =>
      prev.map((s) => ({
        ...s,
        status: 'completed',
      }))
    );
    setCurrentStepIndex(4);
    setFirebaseStatus('connected');
    setPredictions(generated.predictions);
    setHasRevealed(true);
    setLoading(false);
    setShowCheck(true);

    setTimeout(() => {
      setShowCheck(false);
      setShowLoadingList(false);
    }, 1100);
  };

  return (
    <div
      className="min-h-screen text-white relative overflow-x-hidden flex flex-col justify-between selection:bg-purple-600 selection:text-white"
      dir="rtl"
    >
      {/* Background Animated Constellation Network */}
      <NetworkBackground />

      {/* PHASE 1: Login Screen (إدخال اسم المستخدم وكلمة المرور R99) */}
      {appState === 'login' && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}

      {/* PHASE 2: Dedicated Loading Screen (صفحة التحميل) */}
      {appState === 'loading' && (
        <LoadingPage
          username={currentUser}
          password={hackPassword}
          onComplete={handleLoadingComplete}
        />
      )}

      {/* PHASE 3: Main Authenticated Game View */}
      {appState === 'authenticated' && (
        <>
          {/* Header Bar */}
          <HeaderPills
            username={currentUser}
            hackPassword={hackPassword}
            onLogout={handleLogout}
          />

          {/* Main Game Prediction Content Container */}
          <main className="w-full max-w-lg mx-auto px-2 sm:px-4 flex-1 flex flex-col items-center justify-center my-1 sm:my-2">
            
            {/* Permanent Codes / Attempts Banner */}
            <div className="w-full flex items-center justify-center gap-2 mb-2 sm:mb-3">
              <div className="flex items-center gap-2 bg-black/50 px-4 py-1.5 rounded-full border border-purple-500/50 backdrop-blur-md shadow-[0_2px_15px_rgba(139,92,246,0.3)]">
                <KeyRound className="w-3.5 h-3.5 text-[#f0d14a]" />
                <span className="text-xs sm:text-sm font-bold text-[#f0d14a]">
                  حالة الكود والمحاولات:
                </span>
                <span
                  id="attemptsCounter"
                  className="bg-emerald-950/80 text-emerald-300 font-mono font-black text-xs sm:text-sm px-3 py-0.5 rounded-full border border-emerald-400/50 flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                >
                  <span>دائم وغير محدود ♾️</span>
                </span>
              </div>
            </div>

            {/* Loading List Display (When Syncing with Firebase) */}
            {showLoadingList && (
              <div className="w-full mb-3">
                <LoadingList
                  steps={loadingSteps}
                  currentStepIndex={currentStepIndex}
                  firebaseStatus={firebaseStatus}
                />
              </div>
            )}

            {/* 10x5 Apple Grid with Multipliers (m1 to M50) */}
            <div className="w-full bg-black/35 p-2 sm:p-3 rounded-2xl border border-purple-500/35 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
              <AppleGrid
                predictions={predictions}
                hasRevealed={hasRevealed}
                showMIndexTag={false}
              />
            </div>

            {/* Main Refresh / Start Button */}
            <div className="mt-3 sm:mt-4 flex flex-col items-center gap-2">
              <button
                id="startBtn"
                disabled={loading}
                onClick={() => handleRefreshPredictions(true)}
                aria-label="Refresh predictions button"
                className={`px-8 sm:px-10 py-2.5 sm:py-3 rounded-2xl font-black text-sm sm:text-base tracking-wide text-white transition-all duration-300 flex items-center justify-center gap-2 min-w-[140px] select-none ${
                  loading
                    ? 'bg-purple-900 cursor-wait opacity-80'
                    : 'bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] hover:from-[#9333ea] hover:to-[#581c87] shadow-[0_6px_20px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_25px_rgba(139,92,246,0.6)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                } ${isFlipping ? 'animate-[flipY_0.6s_ease_forwards]' : ''}`}
              >
                <span>{loading ? 'جاري التوليد والمزامنة...' : 'Refresh'}</span>

                {/* Spinner */}
                {loading && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}

                {/* Success Checkmark */}
                {showCheck && (
                  <span className="text-emerald-300 animate-scaleUp">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
              </button>

              {/* Realtime Database Sync Info */}
              <div className="flex items-center gap-1.5 text-[11px] text-purple-300/80 font-mono">
                <Database className="w-3 h-3 text-purple-400" />
                <span>Firebase RTDB:</span>
                <span className="text-emerald-400 font-bold">Dream Bet Mode (50 Nodes Synced)</span>
              </div>
            </div>
          </main>

          {/* Footer Branding Bar */}
          <footer className="w-full max-w-lg mx-auto px-3 py-3 flex flex-col items-center gap-1.5 text-center select-none">
            <div className="flex items-center justify-center gap-2 border border-[#5a9fff]/80 rounded-xl px-4 py-1.5 bg-black/40 backdrop-blur-sm text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[#f0d14a] font-bold">
                حماية وأمان مع خوارزمية التوقعات السحابية
              </span>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
