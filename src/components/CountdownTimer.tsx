import React from 'react';
import { Play, Pause, RotateCcw, Bell, Sparkles } from 'lucide-react';

interface CountdownTimerProps {
  secondsLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onTriggerNow: () => void;
  intervalMinutes: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  secondsLeft,
  totalSeconds,
  isRunning,
  onTogglePlay,
  onReset,
  onTriggerNow,
  intervalMinutes,
}) => {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - secondsLeft) / totalSeconds) * 100));

  // SVG Circular parameters
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div
      id="countdown-timer-card"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0e3226] via-[#0b241c] to-[#071913] border border-emerald-700/50 p-6 shadow-xl text-center"
    >
      {/* Background Islamic Pattern / Ambient Glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Tag */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-600/40 text-xs font-semibold text-amber-300 mb-5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>التذكير التلقائي: كل {intervalMinutes} دقائق</span>
      </div>

      {/* Circular Progress Gauge */}
      <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-2">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            className="text-emerald-950"
            fill="transparent"
          />
          {/* Active Animated Ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="url(#timerGradient)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
            fill="transparent"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Digital Countdown */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl sm:text-4xl font-black font-mono tracking-wider text-white">
            {formattedTime}
          </span>
          <span className="text-xs font-medium text-emerald-300/80 mt-1">
            {isRunning ? 'حتى التذكير القادم' : 'مؤقت متوقف'}
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          id="toggle-timer-play-btn"
          onClick={onTogglePlay}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-sm active:scale-95 ${
            isRunning
              ? 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 text-amber-300" />
              <span>إيقاف مؤقت</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>استئناف المؤقت</span>
            </>
          )}
        </button>

        <button
          id="trigger-reminder-now-btn"
          onClick={onTriggerNow}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 shadow-md transition active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>إظهار التذكير الآن</span>
        </button>

        <button
          id="reset-timer-btn"
          onClick={onReset}
          aria-label="إعادة ضبط المؤقت"
          className="p-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
