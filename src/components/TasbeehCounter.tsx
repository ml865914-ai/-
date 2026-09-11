import React from 'react';
import { SalawatStats } from '../types';
import { playTasbeehClick, triggerVibration } from '../utils/audio';
import { Sparkles, RotateCcw, Award, CheckCircle2 } from 'lucide-react';

interface TasbeehCounterProps {
  stats: SalawatStats;
  onIncrement: (amount?: number) => void;
  onResetToday: () => void;
}

export const TasbeehCounter: React.FC<TasbeehCounterProps> = ({
  stats,
  onIncrement,
  onResetToday,
}) => {
  const handleCount = (amount: number = 1) => {
    playTasbeehClick();
    triggerVibration([50]);
    onIncrement(amount);
  };

  // Milestones: 33, 100, 300, 1000
  const nextTarget = stats.todayCount < 33 ? 33 : stats.todayCount < 100 ? 100 : stats.todayCount < 300 ? 300 : 1000;
  const progressPercent = Math.min(100, (stats.todayCount / nextTarget) * 100);

  return (
    <div
      id="tasbeeh-counter-card"
      className="rounded-3xl bg-gradient-to-b from-[#0c2d22] via-[#09221a] to-[#071913] border border-emerald-700/50 p-6 shadow-xl text-right"
    >
      <div className="flex items-center justify-between pb-3 border-b border-emerald-800/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white font-cairo">
              مسبحة الصلاة على النبي ﷺ
            </h3>
            <p className="text-xs text-emerald-300/80">أكثر من الصلاة عليه ونل شفاعته</p>
          </div>
        </div>

        <button
          onClick={onResetToday}
          title="تصفير عداد اليوم"
          className="p-2 rounded-xl text-emerald-400 hover:text-white hover:bg-emerald-800/50 transition text-xs flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">تصفير اليوم</span>
        </button>
      </div>

      {/* Target Progress */}
      <div className="mt-4 bg-emerald-950/70 p-3 rounded-2xl border border-emerald-800/40">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-emerald-300">
            الهدف الحالي: <strong className="text-amber-300 font-mono text-sm">{nextTarget}</strong> صلاة
          </span>
          <span className="text-amber-300 font-mono">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-emerald-900 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Touch Beads / Button */}
      <div className="mt-6 flex flex-col items-center justify-center">
        <button
          id="tasbeeh-tap-button"
          onClick={() => handleCount(1)}
          className="relative group w-40 h-40 rounded-full p-2 bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 shadow-2xl active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#0e3b2d] to-[#062118] border-2 border-amber-400/40 flex flex-col items-center justify-center text-center p-3">
            <span className="text-4xl sm:text-5xl font-black text-amber-200 font-mono tracking-tight drop-shadow-md">
              {stats.todayCount}
            </span>
            <span className="text-xs font-semibold text-emerald-300 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              اضغط للتسبيح
            </span>
          </div>
        </button>

        {/* Quick batch buttons */}
        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={() => handleCount(1)}
            className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-amber-200 rounded-xl text-xs font-bold border border-emerald-700/50"
          >
            +1
          </button>
          <button
            onClick={() => handleCount(10)}
            className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-amber-200 rounded-xl text-xs font-bold border border-emerald-700/50"
          >
            +10
          </button>
          <button
            onClick={() => handleCount(33)}
            className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-amber-200 rounded-xl text-xs font-bold border border-emerald-700/50"
          >
            +33 (تسبيحة كاملة)
          </button>
        </div>
      </div>

      {/* Stats footer: today and total */}
      <div className="mt-6 pt-4 border-t border-emerald-800/40 grid grid-cols-2 gap-3 text-center">
        <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40">
          <span className="text-xs text-emerald-300/80 block">صلوات اليوم</span>
          <strong className="text-lg sm:text-xl text-white font-mono">{stats.todayCount}</strong>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40">
          <span className="text-xs text-emerald-300/80 block">المجموع الكلي</span>
          <strong className="text-lg sm:text-xl text-amber-300 font-mono">{stats.totalCount}</strong>
        </div>
      </div>
    </div>
  );
};
