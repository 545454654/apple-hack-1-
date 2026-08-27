import React from 'react';
import { Database, CheckCircle2, Loader2, Sparkles, Server } from 'lucide-react';

export interface LoadingStep {
  id: string;
  title: string;
  detail?: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
}

interface LoadingListProps {
  steps: LoadingStep[];
  currentStepIndex: number;
  firebaseStatus: 'connected' | 'syncing' | 'idle';
}

export const LoadingList: React.FC<LoadingListProps> = ({
  steps,
  currentStepIndex,
  firebaseStatus,
}) => {
  return (
    <div className="w-full bg-black/60 rounded-2xl border border-purple-500/40 p-4 shadow-[0_0_25px_rgba(139,92,246,0.3)] backdrop-blur-md animate-fadeIn">
      {/* Header with Firebase RTDB indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-500/20 mb-3 text-xs">
        <div className="flex items-center gap-2 text-purple-300 font-bold">
          <Database className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>قائمة المزامنة والتحميل (Firebase RTDB)</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-[11px] font-mono text-purple-200">
          <span className={`w-1.5 h-1.5 rounded-full ${firebaseStatus === 'syncing' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          <span>Dream Bet Server</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-2.5">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex && step.status === 'loading';
          const isDone = step.status === 'completed';
          const isPending = step.status === 'pending';

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-2 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-purple-950/50 border border-purple-500/60 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                  : isDone
                  ? 'bg-emerald-950/20 border border-emerald-500/20'
                  : 'bg-zinc-900/30 border border-zinc-800/60 opacity-60'
              }`}
            >
              {/* Icon / Status Badge */}
              <div className="mt-0.5 flex-shrink-0">
                {isCurrent && (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                )}
                {isDone && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                {isPending && (
                  <div className="w-4 h-4 rounded-full border border-zinc-600 flex items-center justify-center text-[10px] text-zinc-500 font-mono">
                    {idx + 1}
                  </div>
                )}
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      isDone
                        ? 'text-emerald-300'
                        : isCurrent
                        ? 'text-purple-200 font-bold'
                        : 'text-zinc-400'
                    }`}
                  >
                    {step.title}
                  </span>
                  {isDone && (
                    <span className="text-[10px] text-emerald-400/80 font-mono">
                      تم بنجاح ✓
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] text-purple-300 font-mono animate-pulse">
                      جاري التنفيذ...
                    </span>
                  )}
                </div>
                {step.detail && (
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate">
                    {step.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
