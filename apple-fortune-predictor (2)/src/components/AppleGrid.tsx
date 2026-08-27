import React from 'react';
import { TARGET_ROWS, isSafeApple } from '../utils/appleLogic';
import { AppleCell } from './AppleCell';

interface AppleGridProps {
  predictions: Record<string, any> | null;
  hasRevealed: boolean;
  activeRow?: number | null;
  selectedCells?: Record<number, number>; // row -> col
  interactive?: boolean;
  onCellClick?: (row: number, col: number) => void;
  showMIndexTag?: boolean;
}

export const AppleGrid: React.FC<AppleGridProps> = ({
  predictions,
  hasRevealed,
  activeRow = null,
  selectedCells = {},
  interactive = false,
  onCellClick,
  showMIndexTag = false,
}) => {
  return (
    <div id="gridContainer" dir="ltr" className="flex flex-col gap-1 sm:gap-1.5 w-full max-w-lg mx-auto">
      {TARGET_ROWS.map((rowInfo) => {
        const isCurrentActive = activeRow === rowInfo.row;
        const selectedCol = selectedCells[rowInfo.row];

        return (
          <div
            key={`row-${rowInfo.row}`}
            className={`flex items-center justify-between gap-1.5 sm:gap-2.5 p-1 rounded-lg transition-colors ${
              isCurrentActive
                ? 'bg-purple-950/40 border border-purple-500/50 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                : 'hover:bg-white/[0.02]'
            }`}
          >
            {/* Multiplier / Odds Badge on the Left */}
            <div
              className={`h-9 sm:h-10 min-w-[58px] sm:min-w-[68px] flex items-center justify-center font-mono text-[11px] sm:text-xs font-black tracking-tight rounded border transition-all ${
                isCurrentActive
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/60 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                  : 'border-[#5a9fff] text-[#8b5cf6] bg-black/40 shadow-sm'
              }`}
            >
              {rowInfo.mult}
            </div>

            {/* 5 Column Grid (columns 0 to 4 from left to right) */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5 flex-1 justify-items-center">
              {Array.from({ length: 5 }).map((_, colIdx) => {
                const isSafe = isSafeApple(predictions, rowInfo.row, colIdx);
                const isCellSelected = selectedCol === colIdx;

                return (
                  <AppleCell
                    key={`cell-${rowInfo.row}-${colIdx}`}
                    rowIdx={rowInfo.row}
                    colIdx={colIdx}
                    isSafe={isSafe}
                    isRevealed={hasRevealed}
                    isSelected={isCellSelected}
                    interactive={interactive}
                    onCellClick={onCellClick}
                    showMIndexTag={showMIndexTag}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
