import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, User, Copy, Check, AlertCircle } from 'lucide-react';

interface LoginProps {
  onSuccess: (userId: string) => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const [uid, setUid] = useState('');
  const [pass, setPass] = useState('');
  const [copied, setCopied] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('A1111');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const cleanUid = uid.trim();
    const cleanPass = pass.trim();

    // Check 10-digit format and correct password
    const isValidId = /^\d{10}$/.test(cleanUid);
    if (!isValidId || cleanPass !== 'A1111') {
      setShowError(true);
      return;
    }

    onSuccess(cleanUid);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative p-4 z-10 select-none">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[420px] bg-cyber-card/90 border-2 border-[#00f7ff]/40 rounded-3xl p-6 md:p-8 backdrop-blur-md neon-shadow-cyan"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#001018] border border-[#00f7ff]/40 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,247,255,0.2)]">
            <Shield className="w-8 h-8 text-[#00f7ff]" />
          </div>
          <h2 className="text-3xl font-black text-[#00f7ff] tracking-wider font-sans uppercase">
            APPLE HACK LOGIN
          </h2>
          <p className="text-xs text-[#00f7ff]/60 mt-1 uppercase tracking-widest font-mono">
            Access Terminal Console
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* User ID Field */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00f7ff]/50">
              <User className="w-5 h-5" />
            </span>
            <input
              type="text"
              dir="rtl"
              maxLength={15}
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="ادخل ID (10 أرقام)"
              className="w-full bg-[#001018] border border-[#00f7ff]/30 text-[#00f7ff] rounded-xl py-3.5 pl-4 pr-12 text-right focus:border-[#00f7ff] focus:ring-1 focus:ring-[#00f7ff]/30 outline-none transition-all placeholder:text-[#00f7ff]/30 font-medium"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00f7ff]/50">
              <Key className="w-5 h-5" />
            </span>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#001018] border border-[#00f7ff]/30 text-[#00f7ff] rounded-xl py-3.5 pl-12 pr-4 focus:border-[#00f7ff] focus:ring-1 focus:ring-[#00f7ff]/30 outline-none transition-all placeholder:text-[#00f7ff]/30 font-mono"
            />
          </div>

          {/* Promocode Panel */}
          <div className="flex gap-3 my-4">
            {/* GREENBET Box */}
            <div className="flex-1 bg-[#001018] border border-[#00f7ff]/30 rounded-2xl p-3 flex flex-col items-center justify-center select-none">
              <span className="text-lg font-black tracking-widest text-[#00f7ff] font-sans">
                GREENBET
              </span>
              <span className="text-[10px] text-[#00f7ff]/50 font-mono uppercase tracking-widest mt-0.5">
                Platform
              </span>
            </div>

            {/* Promocode Box with Copy */}
            <div className="flex-1 bg-[#001018] border border-[#00f7ff]/30 rounded-2xl p-3 flex flex-col items-center justify-center">
              <span className="text-sm text-[#00f7ff]/60 uppercase tracking-widest font-mono text-[10px]">
                PROMOCODE
              </span>
              <span className="text-xl font-black text-[#00f7ff] tracking-wider mt-0.5 font-mono">
                A1111
              </span>
              
              <button
                type="button"
                onClick={handleCopy}
                className="mt-1.5 px-3 py-1 bg-[#00f7ff] hover:bg-[#39ff14] text-[#001018] font-bold text-xs rounded-lg flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#00f7ff] hover:bg-[#39ff14] text-[#001018] font-black text-lg py-4 rounded-full shadow-[0_0_15px_#00f7ff] hover:shadow-[0_0_20px_#39ff14] transition-all cursor-pointer active:scale-[0.98] uppercase tracking-wide mt-2"
          >
            دخول
          </button>
        </form>
      </motion.div>

      {/* Error Dialog Modal */}
      <AnimatePresence>
        {showError && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#001018] border-2 border-[#ff3366] rounded-2xl p-6 max-w-sm w-full text-center shadow-[0_0_30px_#ff3366]"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-[#ff3366]/40 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-[#ff3366]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#ff3366] mb-2 font-sans">
                ❌ البيانات خطأ
              </h3>
              <p className="text-sm text-[#00f7ff]/70 leading-relaxed mb-5" dir="rtl">
                الرقم التعريفي (ID) يجب أن يكون مكوناً من 10 أرقام، وكلمة المرور الصحيحة هي <strong className="font-mono text-[#00f7ff]">A1111</strong>.
              </p>
              <button
                onClick={() => setShowError(false)}
                className="px-6 py-2 bg-[#ff3366] text-white hover:bg-[#ff3366]/80 font-bold rounded-lg transition-all active:scale-95 cursor-pointer"
              >
                حسناً
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
