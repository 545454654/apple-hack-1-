import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface SystemLoadingProps {
  onComplete: () => void;
}

const statusLines = [
  'جارى الاتصال بالسيرفر...',
  'جارى تحميل البيانات...',
  'جارى قراءة الحساب...',
  'جارى فحص الأمان...',
  'تم تأمين الاتصال...'
];

export default function SystemLoading({ onComplete }: SystemLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [visibleLinesCount, setVisibleLinesCount] = useState(0);

  useEffect(() => {
    // Show each status line one by one with a 1.1s delay
    const lineIntervals = statusLines.map((_, index) => {
      return setTimeout(() => {
        setVisibleLinesCount(index + 1);
      }, (index + 1) * 1100);
    });

    // Increment progress percentage smoothly
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const step = Math.random() * 6 + 1;
        const next = Math.min(100, prev + step);
        if (next >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            onComplete();
          }, 850);
        }
        return next;
      });
    }, 180);

    return () => {
      lineIntervals.forEach((timeout) => clearTimeout(timeout));
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative p-4 z-10 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[340px] bg-cyber-card/75 border-2 border-[#00f7ff] rounded-3xl p-6 backdrop-blur-xl neon-shadow-cyan-lg"
      >
        <h3 className="text-center text-xl font-extrabold tracking-[3px] text-[#00f7ff] mb-5 font-mono">
          APPLE HACK SYSTEM
        </h3>

        {/* Diagnostic logs */}
        <div className="space-y-2.5 min-h-[140px] flex flex-col justify-center py-2" dir="rtl">
          {statusLines.map((line, idx) => {
            const isVisible = idx < visibleLinesCount;
            const isLastVisible = idx === visibleLinesCount - 1;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`text-sm font-semibold tracking-wide flex items-center gap-2 ${
                  isLastVisible ? 'text-[#00f7ff]' : 'text-[#00f7ff]/50'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isLastVisible ? 'bg-[#00f7ff] animate-ping' : 'bg-[#00f7ff]/30'}`} />
                <span>{line}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Loading Bar */}
        <div className="mt-6 h-2 bg-[#001c24] rounded-full overflow-hidden border border-[#00f7ff]/10">
          <motion.div
            className="h-full bg-[#00f7ff] shadow-[0_0_12px_#00f7ff]"
            style={{ width: `${progress}%` }}
            transition={{ type: 'spring', damping: 15 }}
          />
        </div>

        {/* Percent */}
        <div className="text-right text-xs font-mono text-[#00f7ff]/80 mt-1.5 font-bold">
          {Math.floor(progress)}%
        </div>
      </motion.div>
    </div>
  );
}
