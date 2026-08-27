import React, { useState } from 'react';
import { motion } from 'motion/react';
import { APPLE_IMAGES, calculateMIndex } from '../utils/appleLogic';

interface AppleCellProps {
  rowIdx: number;
  colIdx: number;
  isSafe: boolean;
  isRevealed: boolean;
  isSelected?: boolean;
  interactive?: boolean;
  onCellClick?: (row: number, col: number) => void;
  showMIndexTag?: boolean;
}

export const AppleCell: React.FC<AppleCellProps> = ({
  rowIdx,
  colIdx,
  isSafe,
  isRevealed,
  isSelected,
  interactive,
  onCellClick,
  showMIndexTag = false,
}) => {
  const mIndex = calculateMIndex(rowIdx, colIdx);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (interactive && onCellClick) {
      onCellClick(rowIdx, colIdx);
    }
  };

  return (
    <motion.div
      id={`cell-m${mIndex}`}
      whileHover={interactive ? { scale: 1.08 } : { scale: 1.04 }}
      whileTap={interactive ? { scale: 0.95 } : undefined}
      onClick={handleClick}
      title={`Row: ${rowIdx} | Col: ${colIdx} -> m${mIndex} (${isRevealed ? (isSafe ? 'سليمة (1)' : 'تالفة (0)') : 'مخفية'})`}
      className={`relative aspect-square w-full max-w-[48px] sm:max-w-[56px] md:max-w-[62px] rounded-full border flex items-center justify-center transition-all duration-300 select-none ${
        interactive ? 'cursor-pointer hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]' : ''
      } ${
        isRevealed
          ? isSafe
            ? 'border-emerald-400/80 bg-emerald-950/40 shadow-[0_0_16px_rgba(52,211,153,0.5)]'
            : 'border-rose-500/50 bg-rose-950/30 opacity-70'
          : isSelected
          ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_12px_rgba(34,211,238,0.5)]'
          : 'border-[#5a9fff]/60 bg-black/40 hover:border-[#8b5cf6] shadow-[0_4px_12px_rgba(0,0,0,0.4)]'
      }`}
    >
      {/* mIndex tiny helper badge if requested */}
      {showMIndexTag && (
        <span className="absolute -top-1.5 -right-1 text-[8px] font-mono px-1 py-0.2 rounded bg-purple-900/90 text-purple-200 border border-purple-500/40 z-10 pointer-events-none">
          m{mIndex}
        </span>
      )}

      {isRevealed ? (
        <motion.div
          key={`revealed-${isSafe}-${mIndex}`}
          initial={{ scale: 0.4, rotateY: 90, opacity: 0 }}
          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full h-full p-0.5 flex items-center justify-center"
        >
          {isSafe ? (
            !imageError ? (
              <img
                src={APPLE_IMAGES.goodApple}
                alt="تفاحة سليمة"
                className="w-[88%] h-[88%] object-contain drop-shadow-[0_2px_8px_rgba(16,185,129,0.7)]"
                onError={() => setImageError(true)}
              />
            ) : (
              // Crisp SVG Fallback for Good Apple
              <div className="w-[88%] h-[88%] rounded-full bg-emerald-600 border border-emerald-300 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                <span className="text-xl">🍎</span>
              </div>
            )
          ) : !imageError ? (
            <img
              src={APPLE_IMAGES.badApple}
              alt="تفاحة تالفة"
              className="w-[88%] h-[88%] object-contain opacity-75 grayscale-[20%] drop-shadow-[0_2px_4px_rgba(239,68,68,0.4)]"
              onError={() => setImageError(true)}
            />
          ) : (
            // Crisp SVG Fallback for Bad Apple
            <div className="w-[88%] h-[88%] rounded-full bg-red-950 border border-red-700/60 flex items-center justify-center">
              <span className="text-sm opacity-40">💥</span>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-1">
          {/* Mystery hidden state badge */}
          <div className="w-[78%] h-[78%] rounded-full bg-gradient-to-br from-purple-900/40 via-black/60 to-purple-950/50 border border-purple-500/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-purple-400/40 animate-pulse" />
          </div>
        </div>
      )}
    </motion.div>
  );
};
