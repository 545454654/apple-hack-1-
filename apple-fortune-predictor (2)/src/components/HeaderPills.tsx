import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, KeyRound, LogOut } from 'lucide-react';

interface HeaderPillsProps {
  username?: string;
  hackPassword?: string;
  onLogout?: () => void;
}

export const HeaderPills: React.FC<HeaderPillsProps> = ({
  username = 'Player',
  hackPassword = 'R99',
  onLogout,
}) => {
  const [userCount, setUserCount] = useState<number>(1185);

  // Live online users random walk matching the authentic script
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount((prev) => {
        const delta = Math.random() < 0.5 ? -1 : 1;
        const change = delta * Math.floor(Math.random() * 3 + 1);
        return Math.max(980, prev + change);
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full max-w-2xl mx-auto px-3 pt-3 pb-2 flex flex-col items-center select-none">
      {/* Top Floating Badges */}
      <div className="w-full flex items-center justify-between gap-2 text-xs">
        {/* Version Badge */}
        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-purple-500/80 text-white font-bold backdrop-blur-md shadow-[0_2px_12px_rgba(139,92,246,0.25)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Version 5.0.0</span>
        </div>

        {/* Database & M50 Status */}
        <div className="flex items-center gap-1.5 bg-purple-950/40 px-3 py-1.5 rounded-full border border-purple-500/60 text-purple-200 font-semibold backdrop-blur-md text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden xs:inline">Firebase RTDB:</span>
          <span className="font-mono text-emerald-300">Active (50 Nodes)</span>
        </div>

        {/* Users Online Pill */}
        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-purple-500/80 text-white font-bold backdrop-blur-md shadow-[0_2px_12px_rgba(139,92,246,0.25)]">
          <User className="w-3.5 h-3.5 text-purple-300" />
          <span className="text-gray-300 hidden xs:inline text-[11px]">Users Online</span>
          <span className="text-purple-300 font-mono font-extrabold">{userCount}</span>
        </div>
      </div>

      {/* User Session Bar */}
      <div className="w-full flex items-center justify-between mt-2 px-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">المستخدم:</span>
          <span className="text-purple-300 font-bold bg-purple-950/50 px-2 py-0.5 rounded border border-purple-500/30">
            {username}
          </span>
          <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
            <KeyRound className="w-3 h-3" />
            <span>كود: {hackPassword}</span>
          </span>
          <span className="text-amber-300 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30 text-[10px]">
            منصة Dream Bet
          </span>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            title="تسجيل الخروج والعودة لصفحة الدخول"
            className="text-gray-400 hover:text-rose-400 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white/5 transition-all text-[11px]"
          >
            <LogOut className="w-3 h-3" />
            <span>خروج</span>
          </button>
        )}
      </div>

      {/* Brand Logo & Title */}
      <div className="mt-3 mb-1 flex flex-col items-center select-none">
        <h1 className="text-4xl sm:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-400 drop-shadow-[0_0_22px_rgba(168,85,247,0.75)] font-sans">
          APPLE HACK
        </h1>
        <p className="text-[11px] sm:text-xs text-purple-300/80 font-medium tracking-wide mt-0.5">
          سكربت Apple Hack • مخصص لمنصة Dream Bet فقط
        </p>
      </div>
    </header>
  );
};
