import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  RotateCcw, 
  Settings, 
  Database, 
  Info, 
  X, 
  Check, 
  AlertTriangle,
  User,
  ShieldAlert,
  Wifi,
  WifiOff
} from 'lucide-react';
import { PredictionsType, RowConfig, FirebaseConfigType } from '../types';
import { 
  generatePredictionsLocal, 
  isSafeApple, 
  uploadPredictionsToFirebase, 
  fetchPredictionsFromFirebase 
} from '../utils';

interface PredictorProps {
  userId: string;
}

const targetRows: RowConfig[] = [
  { mult: "x349.68", row: 9 }, // Top row
  { mult: "x69.93",  row: 8 },
  { mult: "x27.92",  row: 7 },
  { mult: "x11.18",  row: 6 },
  { mult: "x6.71",   row: 5 },
  { mult: "x4.02",   row: 4 },
  { mult: "x2.41",   row: 3 },
  { mult: "x1.93",   row: 2 },
  { mult: "x1.54",   row: 1 },
  { mult: "x1.23",   row: 0 }, // Bottom row where player starts
];

export default function Predictor({ userId }: PredictorProps) {
  // Promo popup (dismissable & auto closes in 6s)
  const [showPromoPopup, setShowPromoPopup] = useState(true);
  const [promoSecondsLeft, setPromoSecondsLeft] = useState(6);

  // Settings modal
  const [showSettings, setShowSettings] = useState(false);
  const [fbConfig, setFbConfig] = useState<FirebaseConfigType>({
    apiKey: 'AIzaSyAlX1ASvDrf5BBtaB72AUYqSoW34YvP_y4',
    authDomain: 'mrwan-dd795.firebaseapp.com',
    databaseURL: 'https://mrwan-dd795-default-rtdb.firebaseio.com',
    projectId: 'mrwan-dd795',
    storageBucket: 'mrwan-dd795.firebasestorage.app',
    messagingSenderId: '12538399995',
    appId: '1:12538399995:web:4a7e6b40f611891fecb45e'
  });
  const [useFirebase, setUseFirebase] = useState(true);

  // Display mode sort: 'both' (whole and sliced) or 'safe-only' (whole only)
  const [displayMode, setDisplayMode] = useState<'both' | 'safe-only'>('both');

  // Core application state
  const [predictions, setPredictions] = useState<PredictionsType | null>(null);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [revealedRowsCount, setRevealedRowsCount] = useState(0); // For staggered cascade

  // Loader state
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [loaderPercent, setLoaderPercent] = useState(0);

  // Feedback notifications
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Countdown timer for the promo popup
  useEffect(() => {
    if (!showPromoPopup) return;
    if (promoSecondsLeft <= 0) {
      setShowPromoPopup(false);
      return;
    }
    const timer = setTimeout(() => {
      setPromoSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [showPromoPopup, promoSecondsLeft]);

  // Load Firebase config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('flash_fb_config');
    const savedToggle = localStorage.getItem('flash_use_fb');
    if (savedConfig) {
      try {
        setFbConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Save default configuration so it's ready and in settings
      const defaultConfig = {
        apiKey: 'AIzaSyAlX1ASvDrf5BBtaB72AUYqSoW34YvP_y4',
        authDomain: 'mrwan-dd795.firebaseapp.com',
        databaseURL: 'https://mrwan-dd795-default-rtdb.firebaseio.com',
        projectId: 'mrwan-dd795',
        storageBucket: 'mrwan-dd795.firebasestorage.app',
        messagingSenderId: '12538399995',
        appId: '1:12538399995:web:4a7e6b40f611891fecb45e'
      };
      localStorage.setItem('flash_fb_config', JSON.stringify(defaultConfig));
    }

    if (savedToggle !== null) {
      setUseFirebase(savedToggle === 'true');
    } else {
      setUseFirebase(true);
      localStorage.setItem('flash_use_fb', 'true');
    }
  }, []);

  const triggerNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Run the loader animation and then trigger prediction reveal
  const runLoader = (shouldReveal: boolean) => {
    setPredictions(null);
    setHasRevealed(false);
    setRevealedRowsCount(0);
    setIsLoaderActive(true);
    setLoaderPercent(0);

    let progress = 0;
    const interval = setInterval(async () => {
      // Simulate non-uniform loader progression
      progress += Math.floor(Math.random() * 5) + 2;
      if (progress >= 100) {
        progress = 100;
        setLoaderPercent(100);
        clearInterval(interval);

        // Perform predictions resolution
        try {
          const freshPredictions = generatePredictionsLocal();

          if (useFirebase && fbConfig.databaseURL) {
            // Upload to remote RTDB under m11
            await uploadPredictionsToFirebase(fbConfig, freshPredictions);
            setPredictions(freshPredictions);
            triggerNotification('تم رفع التوقعات الجديدة إلى الفايربيز بنجاح!', 'success');
          } else {
            // Local offline simulation
            setPredictions(freshPredictions);
          }

          setIsLoaderActive(false);

          if (shouldReveal) {
            triggerStaggeredReveal();
          }
        } catch (err: any) {
          console.error(err);
          setIsLoaderActive(false);
          triggerNotification(`فشل في معالجة الفايربيز: ${err?.message || 'خطأ غير معروف'}`, 'error');
          // Fallback to local offline anyway to avoid bricking the game
          const freshPredictions = generatePredictionsLocal();
          setPredictions(freshPredictions);
          if (shouldReveal) {
            triggerStaggeredReveal();
          }
        }
      } else {
        setLoaderPercent(progress);
      }
    }, 50);
  };

  // Staggered bottom-to-top reveal animation
  const triggerStaggeredReveal = () => {
    setHasRevealed(true);
    setRevealedRowsCount(0);
    
    // Stagger every row by 300ms as requested
    let currentRevealed = 0;
    const interval = setInterval(() => {
      currentRevealed++;
      setRevealedRowsCount(currentRevealed);
      if (currentRevealed >= 10) {
        clearInterval(interval);
      }
    }, 300);
  };

  const saveSettings = () => {
    localStorage.setItem('flash_fb_config', JSON.stringify(fbConfig));
    localStorage.setItem('flash_use_fb', useFirebase ? 'true' : 'false');
    setShowSettings(false);
    triggerNotification('تم حفظ الإعدادات بنجاح', 'success');
  };

  const handleFetchLivePredictions = async () => {
    if (!fbConfig.databaseURL) {
      triggerNotification('يرجى تهيئة رابط قاعدة البيانات أولاً', 'error');
      return;
    }
    try {
      const data = await fetchPredictionsFromFirebase(fbConfig);
      if (data) {
        setPredictions(data);
        triggerStaggeredReveal();
        triggerNotification('تم جلب التوقعات الحية من الفايربيز!', 'success');
      } else {
        triggerNotification('لم يتم العثور على مسار m11 في الفايربيز', 'error');
      }
    } catch (err: any) {
      triggerNotification(`فشل الجلب: ${err?.message || err}`, 'error');
    }
  };

  const renderWholeApple = () => (
    <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] drop-shadow-[0_0_12px_rgba(57,255,20,0.65)]">
      <defs>
        <radialGradient id="appleBodyGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ff4d4d"/>
          <stop offset="70%" stopColor="#d63031"/>
          <stop offset="100%" stopColor="#5f0909"/>
        </radialGradient>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#58d68d"/>
          <stop offset="100%" stopColor="#218f52"/>
        </linearGradient>
      </defs>
      
      {/* Stem */}
      <path d="M50 36 Q45 22 41 20 Q44 20 47 24 Q48 30 50 36" fill="#784212" />
      
      {/* Leaf */}
      <path d="M42 21 C34 14, 28 20, 42 21 Z" fill="url(#leafGrad)" />
      
      {/* Apple Main Shape */}
      <path d="M50 42 C40 37, 21 42, 23 62 C25 79, 45 85, 50 79 C55 85, 75 79, 77 62 C79 42, 60 37, 50 42 Z" fill="url(#appleBodyGrad)" />
      
      {/* Specular Highlight Sheen */}
      <ellipse cx="36" cy="52" rx="7" ry="3.5" transform="rotate(-25 36 52)" fill="#ffffff" opacity="0.7" />
      <circle cx="64" cy="49" r="2.5" fill="#ffffff" opacity="0.35" />
    </svg>
  );

  const renderBittenApple = () => (
    <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] drop-shadow-[0_0_12px_rgba(255,51,102,0.65)]">
      <defs>
        <linearGradient id="coreFleshGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef9e7"/>
          <stop offset="50%" stopColor="#fcf3cf"/>
          <stop offset="100%" stopColor="#f9e79f"/>
        </linearGradient>
      </defs>
      
      {/* Stem */}
      <path d="M50 34 Q47 21 44 19 Q47 19 49 22 Q49 29 50 34" fill="#5c3a21" />
      
      {/* Red skin at top and bottom */}
      {/* Top skin */}
      <path d="M30 40 C32 32, 46 31, 50 36 C54 31, 68 32, 70 40 C65 44, 35 44, 30 40 Z" fill="#cb4335" stroke="#781010" strokeWidth="1" />
      {/* Bottom skin */}
      <path d="M33 71 C33 66, 67 66, 67 71 C63 76, 37 76, 33 71 Z" fill="#cb4335" stroke="#781010" strokeWidth="1" />
      
      {/* Core eaten flesh column */}
      <path d="M30 40 C35 44, 44 49, 44 55 C44 61, 35 67, 33 71 C42 69, 58 69, 67 71 C65 67, 56 61, 56 55 C56 49, 65 44, 70 40 C58 41, 42 41, 30 40 Z" fill="url(#coreFleshGrad)" />
      
      {/* Core details & seeds */}
      <circle cx="47" cy="54" r="1.5" fill="#2c1a0c" />
      <circle cx="53" cy="56" r="1.5" fill="#2c1a0c" />
      
      {/* Bite contour curves */}
      <path d="M30 40 C33 42, 38 41, 40 44 C42 47, 43 51, 44 55 C45 59, 43 64, 40 66 C37 68, 34 67, 33 71" fill="none" stroke="#f7dc6f" strokeWidth="1" />
      <path d="M70 40 C67 42, 62 41, 60 44 C58 47, 57 51, 56 55 C55 59, 57 64, 60 66 C63 68, 66 67, 67 71" fill="none" stroke="#f7dc6f" strokeWidth="1" />
    </svg>
  );

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-6 px-4 md:px-6 relative z-10 select-none max-w-md mx-auto">
      
      {/* Dynamic Notification bar */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl flex items-center gap-3 border text-sm font-bold shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-950/95 text-green-400 border-green-500/40 neon-shadow-green' 
                : 'bg-red-950/95 text-red-400 border-red-500/40 neon-shadow-red'
            }`}
          >
            {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span dir="rtl">{notification.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Panel */}
      <div className="w-full flex justify-between items-center bg-cyber-card border border-[#00f7ff]/20 rounded-2xl px-4 py-3 mb-4 neon-shadow-cyan">
        <div className="flex items-center gap-2">
          {useFirebase ? (
            <div className="flex items-center gap-1.5 text-[#39ff14] text-xs font-mono font-bold uppercase tracking-wider bg-green-950/40 border border-green-500/30 px-2.5 py-1 rounded-full">
              <Wifi className="w-3.5 h-3.5" />
              <span>LIVE CLOUD</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[#00f7ff]/70 text-xs font-mono font-bold uppercase tracking-wider bg-[#001018] border border-[#00f7ff]/20 px-2.5 py-1 rounded-full">
              <WifiOff className="w-3.5 h-3.5" />
              <span>OFFLINE</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#00f7ff]/60 uppercase tracking-widest bg-[#001018] px-3 py-1 rounded-lg border border-[#00f7ff]/10 flex items-center gap-1.5 font-bold">
            <User className="w-3.5 h-3.5 text-[#00f7ff]" />
            ID: {userId}
          </span>
        </div>
      </div>

      {/* Main Brand Title */}
      <div className="w-full text-center mb-4">
        <h2 className="text-3xl font-black text-[#00f7ff] tracking-[4px] neon-text-cyan font-sans uppercase">
          APPLE HACK
        </h2>
        <div className="h-[3px] w-full bg-[#001c24] rounded-full overflow-hidden mt-2 relative border border-[#00f7ff]/10">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-[#00f7ff] to-transparent animate-[slide_1.2s_linear_infinite]" />
        </div>
      </div>

      {/* Central Interactive Grid Card */}
      <div className="w-full bg-cyber-card border border-[#00f7ff]/30 rounded-3xl p-4 shadow-[0_0_20px_rgba(0,247,255,0.15)] backdrop-blur-md">
        
        {/* Cyber Display Mode Switcher / Sort Selector */}
        <div className="flex gap-2 mb-4 p-1 bg-[#001018] border border-[#00f7ff]/20 rounded-2xl">
          <button
            onClick={() => setDisplayMode('both')}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-wider flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
              displayMode === 'both'
                ? 'bg-[#00f7ff] text-[#001018] shadow-[0_0_10px_rgba(0,247,255,0.3)] font-black'
                : 'text-[#00f7ff]/60 hover:text-[#00f7ff]'
            }`}
          >
            <span className="text-[13px] font-sans">النوع الأول (كامل وتالف)</span>
            <span className="text-[9px] font-mono opacity-85">Whole & Sliced</span>
          </button>
          <button
            onClick={() => setDisplayMode('safe-only')}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-wider flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
              displayMode === 'safe-only'
                ? 'bg-[#00f7ff] text-[#001018] shadow-[0_0_10px_rgba(0,247,255,0.3)]'
                : 'text-[#00f7ff]/60 hover:text-[#00f7ff]'
            }`}
          >
            <span className="text-[13px] font-sans">النوع الثاني (سليم فقط)</span>
            <span className="text-[9px] font-mono opacity-85">Safe Only</span>
          </button>
        </div>

        {/* Loader Screen overlaying the board during prediction analysis */}
        {isLoaderActive ? (
          <div className="py-24 flex flex-col items-center justify-center">
            {/* Spinning Neon Cyber Circle */}
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-[#002a33] border-t-4 border-t-[#00f7ff] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-[#00f7ff] font-mono">
                {Math.floor(loaderPercent)}%
              </div>
            </div>

            {/* Custom Horizontal loader bar */}
            <div className="w-64 h-2.5 bg-[#001a22] rounded-full overflow-hidden border border-[#00f7ff]/20 neon-shadow-cyan">
              <div 
                className="h-full bg-[#00f7ff] shadow-[0_0_12px_#00f7ff] transition-all duration-75"
                style={{ width: `${loaderPercent}%` }}
              />
            </div>
            
            <p className="mt-4 text-xs font-mono text-[#00f7ff] uppercase tracking-widest font-bold">
              Calculating Quantum Distributions...
            </p>
          </div>
        ) : (
          /* Staggered Prediction Board Grid */
          <div className="flex flex-col gap-2.5">
            {targetRows.map((rowInfo, rIdx) => {
              // Row 0 is at bottom (index 9 in display list), Row 9 is at top (index 0 in display list)
              // We reveal rows from bottom (row 0) to top (row 9)
              // Row with rowInfo.row is revealed if:
              // hasRevealed is true, and rowInfo.row < revealedRowsCount
              const isRowRevealed = hasRevealed && rowInfo.row < revealedRowsCount;

              return (
                <div key={rIdx} className="flex items-center gap-3">
                  {/* Multiplier Tag */}
                  <span className="text-xs font-extrabold font-mono text-[#00f7ff]/80 bg-[#001a22]/80 border border-[#00f7ff]/15 py-1.5 w-[75px] text-center rounded-xl shadow-[0_0_6px_rgba(0,247,255,0.05)]">
                    {rowInfo.mult}
                  </span>

                  {/* 5 Column Grid for current row */}
                  <div className="grid grid-cols-5 gap-2 flex-1">
                    {Array.from({ length: 5 }).map((_, cIdx) => {
                      const isSafe = isSafeApple(predictions, rowInfo.row, cIdx);

                      return (
                        <div
                          key={cIdx}
                          className={`aspect-square rounded-xl border flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                            isRowRevealed
                              ? isSafe
                                ? 'border-[#39ff14]/50 bg-[#39ff14]/5 shadow-[0_0_14px_rgba(57,255,20,0.35)]'
                                : displayMode === 'both'
                                  ? 'border-[#ff3366]/40 bg-[#ff3366]/5 shadow-[0_0_12px_rgba(255,51,102,0.25)]'
                                  : 'border-[#ff3366]/5 bg-[#ff3366]/2 opacity-35'
                              : 'border-[#00f7ff]/10 bg-[#001018]/50 shadow-[inset_0_0_10px_rgba(0,247,255,0.02)]'
                          }`}
                        >
                          {/* Animated vector apple shapes */}
                          {isRowRevealed && (
                            isSafe ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', damping: 10, stiffness: 120 }}
                                className="w-full h-full flex items-center justify-center p-0.5"
                              >
                                {renderWholeApple()}
                              </motion.div>
                            ) : (
                              displayMode === 'both' ? (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                                  className="w-full h-full flex items-center justify-center p-0.5"
                                >
                                  {renderBittenApple()}
                                </motion.div>
                              ) : null
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Primary Execution Controls */}
      {!isLoaderActive && (
        <div className="w-full flex flex-col gap-3 mt-4">
          <button
            onClick={() => runLoader(true)}
            className="w-full bg-[#00f7ff] hover:bg-[#39ff14] text-[#001018] font-black text-lg py-4 rounded-2xl shadow-[0_0_15px_rgba(0,247,255,0.4)] hover:shadow-[0_0_20px_#39ff14] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wider"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>GET AVAILABLE / جلب المتاح</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => runLoader(false)}
              className="flex-1 bg-cyber-card border border-[#00f7ff]/40 text-[#00f7ff] hover:border-[#39ff14] hover:text-[#39ff14] font-extrabold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RELOAD</span>
            </button>

            {useFirebase && (
              <button
                onClick={handleFetchLivePredictions}
                className="flex-1 bg-cyber-card border border-green-500/40 text-green-400 hover:border-green-400 hover:text-green-300 font-extrabold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                dir="rtl"
              >
                <Database className="w-4 h-4" />
                <span>جلب السحابة</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6-Second Auto Promo code modal */}
      <AnimatePresence>
        {showPromoPopup && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 select-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#001018] border-2 border-[#00f7ff] rounded-3xl p-6 max-w-sm w-full text-center shadow-[0_0_35px_#00f7ff] relative overflow-hidden"
            >
              <button
                onClick={() => setShowPromoPopup(false)}
                className="absolute top-4 right-4 text-[#00f7ff]/60 hover:text-[#00f7ff] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full bg-[#00202a] border border-[#00f7ff]/40 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <ShieldAlert className="w-6 h-6 text-[#00f7ff]" />
              </div>

              {/* Countdown counter badge */}
              <div className="absolute top-4 left-4 text-xs font-mono bg-[#002a33] text-[#00f7ff] px-2.5 py-1 rounded-full border border-[#00f7ff]/20 font-bold">
                {promoSecondsLeft}s
              </div>

              <div className="space-y-3 text-right leading-loose text-base font-extrabold text-[#00f7ff]" dir="rtl">
                <p>
                  لازم تسجل بالبروموكود <strong className="text-xl text-yellow-400 font-mono underline shadow-sm">A1111</strong>
                </p>
                <p>
                  على منصة <strong className="text-xl text-[#39ff14] tracking-wide font-sans">GREENBET</strong>
                </p>
                <p>
                  وتعمل إيداع <strong className="text-xl text-yellow-400 font-mono">200 جنيه</strong>
                </p>
                <p>
                  علشان الاسكربت يشتغل معاك <strong className="text-[#39ff14] text-xl">100%</strong>
                </p>
              </div>

              <button
                onClick={() => setShowPromoPopup(false)}
                className="mt-6 w-full bg-[#00f7ff] text-[#001018] hover:bg-[#39ff14] font-black py-3 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                حسناً وفهمت
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Firebase cloud settings panel Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#001018] border-2 border-[#00f7ff] rounded-3xl p-6 max-w-sm w-full shadow-[0_0_35px_#00f7ff]"
              dir="rtl"
            >
              <div className="flex justify-between items-center mb-5 border-b border-[#00f7ff]/20 pb-3">
                <h3 className="text-xl font-black text-[#00f7ff] flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  <span>تكوين السحابة (Firebase)</span>
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-[#00f7ff]/60 hover:text-[#00f7ff] transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Enabled toggle */}
              <div className="flex justify-between items-center bg-[#002a33]/40 border border-[#00f7ff]/10 rounded-xl p-3 mb-4">
                <span className="font-bold text-sm text-[#00f7ff]/90">تفعيل الربط السحابي (Live RTDB)</span>
                <input
                  type="checkbox"
                  checked={useFirebase}
                  onChange={(e) => setUseFirebase(e.target.checked)}
                  className="w-5 h-5 accent-[#00f7ff] cursor-pointer"
                />
              </div>

              <div className="space-y-3.5 mb-5">
                <div>
                  <label className="block text-xs font-bold text-[#00f7ff]/60 mb-1">معرف المشروع (Project ID)</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={fbConfig.projectId || ''}
                    onChange={(e) => setFbConfig({ ...fbConfig, projectId: e.target.value })}
                    placeholder="my-firebase-project-id"
                    className="w-full bg-[#000d14] border border-[#00f7ff]/20 text-[#00f7ff] text-sm rounded-lg p-2.5 outline-none focus:border-[#00f7ff] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#00f7ff]/60 mb-1">رابط قاعدة البيانات (RTDB URL)</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={fbConfig.databaseURL || ''}
                    onChange={(e) => setFbConfig({ ...fbConfig, databaseURL: e.target.value })}
                    placeholder="https://...firebaseio.com"
                    className="w-full bg-[#000d14] border border-[#00f7ff]/20 text-[#00f7ff] text-sm rounded-lg p-2.5 outline-none focus:border-[#00f7ff] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#00f7ff]/60 mb-1">مفتاح الواجهة (API Key - اختياري)</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={fbConfig.apiKey || ''}
                    onChange={(e) => setFbConfig({ ...fbConfig, apiKey: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full bg-[#000d14] border border-[#00f7ff]/20 text-[#00f7ff] text-sm rounded-lg p-2.5 outline-none focus:border-[#00f7ff] font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 bg-[#002a33]/15 border border-[#00f7ff]/10 rounded-xl p-3 mb-6 text-xs text-[#00f7ff]/70 leading-relaxed">
                <Info className="w-5 h-5 text-[#00f7ff] shrink-0" />
                <p>
                  عند تفعيل السحابة وكتابة البيانات، سيقوم السكريبت برفع التوقعات الحية مباشرة تحت مسار <code className="font-mono bg-[#001018] px-1 rounded text-yellow-400">m11</code> متوافقة 100% مع الكود المطلوب.
                </p>
              </div>

              <button
                onClick={saveSettings}
                className="w-full bg-[#00f7ff] hover:bg-[#39ff14] text-[#001018] font-black py-3 rounded-xl shadow-[0_0_12px_#00f7ff] transition-all cursor-pointer"
              >
                حفظ وإغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
