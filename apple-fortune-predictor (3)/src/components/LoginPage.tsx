import React, { useState } from 'react';
import { Lock, User, Key, ShieldCheck, AlertCircle, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (username: string, password: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser) {
      setError('يرجى إدخال اسم المستخدم أولاً');
      return;
    }

    if (!cleanPass) {
      setError('يرجى إدخال كلمة مرور الهاك (كود التفعيل)');
      return;
    }

    // Check if password matches R99
    if (cleanPass.toUpperCase() !== 'R99') {
      setError('كلمة المرور غير صحيحة! كلمة المرور المعتمدة هي: R99');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onLoginSuccess(cleanUser, 'R99');
    }, 600);
  };

  const handleQuickFill = () => {
    if (!username) setUsername('User_' + Math.floor(1000 + Math.random() * 9000));
    setPassword('R99');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative select-none" dir="rtl">
      {/* Centered Login Card */}
      <div className="w-full max-w-md bg-zinc-950/90 border-2 border-purple-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(139,92,246,0.35)] backdrop-blur-xl relative overflow-hidden animate-fadeIn">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Logo / Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-900 via-purple-700 to-indigo-600 border border-purple-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)] mb-3">
            <Lock className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-200 to-indigo-300 font-sans">
            APPLE HACK
          </h1>
          <p className="text-xs text-purple-300/80 font-medium mt-1">
            تسجيل الدخول وتفعيل سكربت Apple Hack لمنصة Greenbet فقط
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Input */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>اسم المستخدم / معرف الحساب:</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم (مثال: Player123)"
                className="w-full bg-black/60 border border-purple-500/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition-all font-sans"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Input (R99) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-400" />
                <span>كلمة مرور الهاك (User hack password):</span>
              </label>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-1 font-mono"
              >
                <Sparkles className="w-3 h-3" />
                إدراج كود R99
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور: R99"
                className="w-full bg-black/60 border border-purple-500/40 rounded-xl px-4 py-3 text-sm text-purple-300 font-mono tracking-wider placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition-all"
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 flex items-center gap-2 text-rose-300 text-xs animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] hover:from-[#9333ea] hover:to-[#5b21b6] shadow-[0_4px_20px_rgba(139,92,246,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري التحقق والاتصال...</span>
              </>
            ) : (
              <>
                <span>إرسال كلمة المرور والدخول</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Database & Code Info Badges */}
        <div className="mt-6 pt-4 border-t border-purple-500/20 flex flex-col gap-2 text-[11px] text-gray-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gray-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>حالة الكود والمحاولات:</span>
            </span>
            <span className="font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
              دائم ومفعل (R99)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">قاعدة البيانات:</span>
            <span className="font-mono text-purple-300">Firebase RTDB (تشفير سحابي)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">المنصة المدعومة:</span>
            <span className="font-mono text-emerald-400 font-bold">Greenbet حصراً</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">نطاق اللوحة:</span>
            <span className="font-mono text-cyan-300">50 خانة (m1 إلى M50)</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <span className="text-[11px] text-gray-400 font-medium">
            النظام محمي ومؤمن عبر بروتوكول Firebase RTDB المشفر
          </span>
        </div>
      </div>
    </div>
  );
};
