import React, { useEffect, useState } from 'react';
import { Database, CheckCircle2, Loader2, KeyRound, ShieldCheck, Cpu } from 'lucide-react';

interface LoadingPageProps {
  username: string;
  password: string; // "R99"
  onComplete: () => void;
}

interface StepItem {
  id: string;
  title: string;
  desc: string;
  status: 'pending' | 'loading' | 'done';
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  username,
  password,
  onComplete,
}) => {
  const [progress, setProgress] = useState<number>(10);
  const [steps, setSteps] = useState<StepItem[]>([
    {
      id: 'auth',
      title: 'التحقق من كلمة مرور الهاك (User hack password)',
      desc: `تم إرسال وقبول الكود: ${password} للمستخدم [${username}] لمنصة Greenbet`,
      status: 'loading',
    },
    {
      id: 'rtdb',
      title: 'الاتصال بقاعدة بيانات Firebase RTDB',
      desc: 'https://swtyyyy-6ca13-default-rtdb.firebaseio.com',
      status: 'pending',
    },
    {
      id: 'platform',
      title: 'تهيئة وتوجيه السيرفر لمنصة Greenbet',
      desc: 'قراءة الأجسام المتداخلة وتثبيت حالة الكود والمحاولات (دائم ♾️)',
      status: 'pending',
    },
    {
      id: 'm50',
      title: 'مزامنة وتفعيل مصفوفة الـ 50 خانة (m1 إلى M50)',
      desc: 'حساب خوارزمية التوزيع العشوائي الآمن من الصف 0 إلى الصف 9',
      status: 'pending',
    },
    {
      id: 'ready',
      title: 'اكتمال الإعداد وتوجيه اللوحة',
      desc: 'تم تفعيل سكربت Apple Hack بنجاح تام',
      status: 'pending',
    },
  ]);

  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      current += 1;

      if (current === 1) {
        setProgress(28);
        setSteps((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx === 0 ? 'done' : idx === 1 ? 'loading' : 'pending',
          }))
        );
      } else if (current === 2) {
        setProgress(52);
        setSteps((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx <= 1 ? 'done' : idx === 2 ? 'loading' : 'pending',
          }))
        );
      } else if (current === 3) {
        setProgress(78);
        setSteps((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx <= 2 ? 'done' : idx === 3 ? 'loading' : 'pending',
          }))
        );
      } else if (current === 4) {
        setProgress(100);
        setSteps((prev) =>
          prev.map((s) => ({
            ...s,
            status: 'done',
          }))
        );
      } else if (current >= 5) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative select-none" dir="rtl">
      <div className="w-full max-w-lg bg-zinc-950/90 border-2 border-purple-500/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(139,92,246,0.35)] backdrop-blur-xl relative overflow-hidden animate-fadeIn">
        
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-full border-4 border-purple-500/40 border-t-purple-400 animate-spin flex items-center justify-center">
              <Cpu className="w-7 h-7 text-purple-300" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            صفحة التحميل والمزامنة السحابية
          </h2>
          <p className="text-xs text-purple-300/80 mt-1">
            جاري الاتصال بـ Firebase RTDB وتحميل مصفوفة M50
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5 px-1">
            <span className="text-purple-300 font-bold">نسبة التحميل والتثبيت</span>
            <span className="text-emerald-400 font-extrabold">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-black/60 rounded-full border border-purple-500/30 overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps Card */}
        <div className="space-y-2.5 mb-6">
          {steps.map((s) => {
            const isLoading = s.status === 'loading';
            const isDone = s.status === 'done';

            return (
              <div
                key={s.id}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  isLoading
                    ? 'bg-purple-950/60 border-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                    : isDone
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-black/40 border-zinc-800/80 opacity-50'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isLoading && <Loader2 className="w-4 h-4 text-purple-300 animate-spin" />}
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {s.status === 'pending' && (
                    <div className="w-4 h-4 rounded-full border border-zinc-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs font-bold ${
                        isDone ? 'text-emerald-300' : isLoading ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {s.title}
                    </h4>
                    {isDone && (
                      <span className="text-[10px] text-emerald-400 font-mono">جاهز ✓</span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Badges */}
        <div className="p-3 bg-black/60 rounded-xl border border-purple-500/20 flex items-center justify-around text-center text-xs font-mono">
          <div>
            <span className="text-gray-400 block text-[10px]">كود المرور</span>
            <span className="text-purple-300 font-bold">{password}</span>
          </div>
          <div className="h-6 w-[1px] bg-purple-500/20" />
          <div>
            <span className="text-gray-400 block text-[10px]">المنصة</span>
            <span className="text-emerald-400 font-bold">Greenbet</span>
          </div>
          <div className="h-6 w-[1px] bg-purple-500/20" />
          <div>
            <span className="text-gray-400 block text-[10px]">الخانات</span>
            <span className="text-emerald-400 font-bold">m1 - M50</span>
          </div>
        </div>
      </div>
    </div>
  );
};
