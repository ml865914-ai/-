import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share2, PlusSquare, X } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // If already installed or dismissed, do not display banner
  if (isInstalled || isDismissed) {
    return null;
  }

  return (
    <>
      <aside
        id="pwa-install-banner"
        aria-label="تثبيت التطبيق على الهاتف"
        className="w-full bg-gradient-to-r from-emerald-900/90 via-emerald-800/90 to-teal-900/90 border-b border-emerald-600/40 px-4 py-2.5 shadow-md backdrop-blur-md transition-all"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white text-xs sm:text-sm">
                ثبّت التطبيق على هاتفك ليعمل كتطبيق جوال أصيل
              </p>
              <p className="text-emerald-200 text-xs hidden sm:block">
                تنبيهات منبثقة، وتذكير دوري كل 5 دقائق بدون انقطاع
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isInstallable && (
              <button
                id="pwa-install-button"
                onClick={install}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>تثبيت الآن</span>
              </button>
            )}

            {isIOS && (
              <button
                id="pwa-ios-guide-button"
                onClick={() => setShowIOSModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm transition active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>تثبيت في آيفون</span>
              </button>
            )}

            {!isInstallable && !isIOS && (
              <button
                id="pwa-general-install-hint"
                onClick={() => alert('لتثبيت التطبيق: افتح قائمة خيارات المتصفح (⋮) ثم اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100 font-medium text-xs rounded-lg border border-emerald-500/30 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>طريقة التثبيت</span>
              </button>
            )}

            <button
              id="pwa-dismiss-button"
              onClick={() => setIsDismissed(true)}
              aria-label="إغلاق شريط التثبيت"
              className="text-emerald-300 hover:text-white p-1 rounded-md transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* iOS Safari Guided Install Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#09261d] border border-emerald-600/50 p-6 shadow-2xl text-white text-right">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-700/50">
              <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                تثبيت على iPhone و iPad
              </h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-emerald-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-emerald-100">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                <div className="p-2 rounded-lg bg-emerald-800/80 text-amber-300 shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-white font-semibold">1. اضغط زر المشاركة</strong>
                  <span className="text-xs text-emerald-300">في أسفل متصفح Safari اضغط على أيقونة المشاركة (مربع مع سهم لأعلى).</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                <div className="p-2 rounded-lg bg-emerald-800/80 text-amber-300 shrink-0">
                  <PlusSquare className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-white font-semibold">2. إضافة إلى الشاشة الرئيسية</strong>
                  <span className="text-xs text-emerald-300">مرر للأسفل واضغط على خيار «إضافة إلى الشاشة الرئيسية» (Add to Home Screen).</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full rounded-xl bg-amber-500 py-2.5 font-bold text-emerald-950 hover:bg-amber-400 transition"
            >
              فهمت، شكراً لك
            </button>
          </div>
        </div>
      )}
    </>
  );
};
