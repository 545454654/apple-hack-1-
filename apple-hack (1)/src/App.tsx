import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppPhase } from './types';
import CyberCanvas from './components/CyberCanvas';
import SplashIntro from './components/SplashIntro';
import Login from './components/Login';
import SystemLoading from './components/SystemLoading';
import Predictor from './components/Predictor';

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('splash');
  const [userId, setUserId] = useState('');

  const handleSplashComplete = () => {
    setPhase('login');
  };

  const handleLoginSuccess = (enteredId: string) => {
    setUserId(enteredId);
    setPhase('loading');
  };

  const handleLoadingComplete = () => {
    setPhase('dashboard');
  };

  return (
    <main className="relative min-h-screen w-full bg-[#010409] text-[#00f7ff] overflow-x-hidden font-sans select-none">
      {/* Background cyber network canvas */}
      <CyberCanvas />

      {/* Structured visual phase transitions */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 'splash' && (
            <motion.div
              key="splash-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center items-center"
            >
              <SplashIntro onComplete={handleSplashComplete} />
            </motion.div>
          )}

          {phase === 'login' && (
            <motion.div
              key="login-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center items-center"
            >
              <Login onSuccess={handleLoginSuccess} />
            </motion.div>
          )}

          {phase === 'loading' && (
            <motion.div
              key="loading-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center items-center"
            >
              <SystemLoading onComplete={handleLoadingComplete} />
            </motion.div>
          )}

          {phase === 'dashboard' && (
            <motion.div
              key="dashboard-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center items-center"
            >
              <Predictor userId={userId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

