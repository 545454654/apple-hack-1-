import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface SplashIntroProps {
  onComplete: () => void;
}

export default function SplashIntro({ onComplete }: SplashIntroProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Simulate non-linear realistic loading speed
      const step = Math.random() * 15 + 2;
      current = Math.min(100, current + step);
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        const timeout = setTimeout(() => {
          onComplete();
        }, 500);
        return () => clearTimeout(timeout);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative p-6 select-none z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-sm flex flex-col items-center text-center"
      >
        {/* Pulsing Neon Logo */}
        <motion.h1
          animate={{
            textShadow: [
              '0 0 15px rgba(0,247,255,0.6)',
              '0 0 35px rgba(0,247,255,0.9)',
              '0 0 15px rgba(0,247,255,0.6)'
            ],
            scale: [1, 1.04, 1]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="text-5xl font-black tracking-widest text-[#00f7ff] select-none mb-6 font-sans"
        >
          APPLE HACK
        </motion.h1>

        {/* Dynamic status line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-mono text-[#00f7ff]/90 mb-8 tracking-wider uppercase text-center"
        >
          Initializing secure environment...
        </motion.p>

        {/* Outer progress border */}
        <div className="w-64 h-2 bg-[#001c24] rounded-full overflow-hidden border border-[#00f7ff]/20 neon-shadow-cyan">
          {/* Inner animated filling bar */}
          <motion.div
            className="h-full bg-[#00f7ff] shadow-[0_0_12px_#00f7ff]"
            style={{ width: `${progress}%` }}
            transition={{ type: 'spring', damping: 15 }}
          />
        </div>

        {/* Loading numeric status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="mt-3 text-xs font-mono text-[#00f7ff]"
        >
          SECURE_BOOT: {Math.floor(progress)}%
        </motion.div>
      </motion.div>
    </div>
  );
}
