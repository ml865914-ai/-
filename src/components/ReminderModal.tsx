import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SalawatCard } from '../types';
import { playTasbeehClick, triggerVibration } from '../utils/audio';
import { Heart, Share2, Check, X, Sparkles, Volume2, Clock } from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: SalawatCard;
  onIncrementCount: (amount?: number) => void;
  intervalMinutes: number;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  card,
  onIncrementCount,
  intervalMinutes,
}) => {
  const [hasPrayed, setHasPrayed] = useState(false);
  const [justAddedCount, setJustAddedCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrayClick = (amount: number = 1) => {
    playTasbeehClick();
    triggerVibration([80]);
    onIncrementCount(amount);
    setHasPrayed(true);
    setJustAddedCount(amount);

    setTimeout(() => {
      setJustAddedCount(null);
    }, 1500);
  };

  const handleShare = async () => {
    const textToShare = `${card.arabicText}\n\n${card.virtueDescription}\n[المصدر: ${card.source}]\n\nصلِّ على الحبيب ﷺ - تطبيق الصلاة على النبي`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'الصلاة على النبي ﷺ',
          text: textToShare,
          url: window.location.href,
        });
      } catch {
        // Fallback copy
        copyToClipboard(textToShare);
      }
    } else {
      copyToClipboard(textToShare);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
        {/* Overlay backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-gradient-to-b from-[#0d2a20] via-[#091f17] to-[#061711] border border-amber-500/40 shadow-2xl z-10 text-right"
          id="salawat-popup-modal"
        >
          {/* Top Decorative Header */}
          <div className="relative px-5 pt-5 pb-3 flex items-center justify-between border-b border-emerald-800/40 bg-emerald-950/40">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                تذكير كل {intervalMinutes} دقائق
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-emerald-100 flex items-center gap-1.5 font-cairo">
              <Sparkles className="w-4 h-4 text-amber-400" />
              صلِّ على رسول الله ﷺ
            </h2>

            <button
              id="close-reminder-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-full text-emerald-400 hover:text-white hover:bg-emerald-800/50 transition"
              aria-label="إغلاق التذكير"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Picture / Card Image Banner */}
          <div className="relative w-full h-44 sm:h-52 overflow-hidden bg-emerald-950">
            {card.imagePath && (
              <img
                src={card.imagePath}
                alt={card.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2a20] via-emerald-950/40 to-transparent" />
            
            {/* Overlay badge with Prophet Muhammad ﷺ Calligraphy emblem */}
            <div className="absolute bottom-3 right-4 left-4 flex items-end justify-between">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30">
                <span className="text-xs font-medium text-amber-200 block">
                  {card.subtitle || 'صلاة مباركة'}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white font-cairo">
                  {card.title}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-lg shrink-0">
                <div className="w-full h-full bg-emerald-950 rounded-[14px] flex items-center justify-center text-amber-300 font-amiri font-bold text-xl">
                  ﷺ
                </div>
              </div>
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Arabic Salawat Text */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-900/40 to-emerald-950/80 border border-emerald-700/40 shadow-inner">
              <p className="text-xl sm:text-2xl text-amber-100 font-amiri leading-loose sm:leading-relaxed text-center font-bold selection:bg-amber-400 selection:text-emerald-950">
                « {card.arabicText} »
              </p>
            </div>

            {/* Hadith & Virtue Note */}
            <div className="space-y-1.5 text-xs sm:text-sm text-emerald-200/90 bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-800/40">
              <div className="flex items-center justify-between text-amber-400/90 text-xs font-semibold">
                <span>{card.source}</span>
                {card.narrator && <span>{card.narrator}</span>}
              </div>
              <p className="text-emerald-100 leading-relaxed font-cairo">
                {card.virtueDescription}
              </p>
            </div>

            {/* Action Buttons: Prayer counter */}
            <div className="pt-2 flex flex-col gap-3">
              <button
                id="modal-prayed-main-btn"
                onClick={() => handlePrayClick(1)}
                className={`relative w-full py-3.5 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                  hasPrayed
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-900/50'
                    : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-emerald-950 shadow-amber-950/50'
                }`}
              >
                <Heart className={`w-5 h-5 ${hasPrayed ? 'fill-white text-white' : 'fill-emerald-950 text-emerald-950'}`} />
                <span>
                  {hasPrayed ? 'صليتُ على النبي ﷺ (زد في الأجر +1)' : 'صليتُ على النبي ﷺ (+1)'}
                </span>

                {justAddedCount && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-white text-emerald-800 font-black text-xs rounded-full animate-bounce">
                    +1
                  </span>
                )}
              </button>

              {/* Extra Tasbeeh Repetitions & Share */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-emerald-300 ml-1">تكرار:</span>
                  <button
                    onClick={() => handlePrayClick(3)}
                    className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/50 text-amber-200 transition"
                  >
                    +3 مرات
                  </button>
                  <button
                    onClick={() => handlePrayClick(10)}
                    className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/50 text-amber-200 transition"
                  >
                    +10 مرات
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="modal-share-card-btn"
                    onClick={handleShare}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/40 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم النسخ' : 'مشاركة'}</span>
                  </button>

                  <button
                    id="modal-dismiss-and-continue-btn"
                    onClick={onClose}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 transition"
                  >
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>متابعة</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
