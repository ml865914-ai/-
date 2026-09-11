import React, { useState, useEffect, useRef } from 'react';
import { SALAWAT_CARDS } from './data/salawatCards';
import { SalawatCard, ReminderSettings, SalawatStats } from './types';
import { playSpiritualChime, triggerVibration } from './utils/audio';
import { sendSalawatNotification, isNotificationSupported } from './utils/notification';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { CountdownTimer } from './components/CountdownTimer';
import { ReminderModal } from './components/ReminderModal';
import { SettingsModal } from './components/SettingsModal';
import { TasbeehCounter } from './components/TasbeehCounter';
import { CardsGallery } from './components/CardsGallery';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  Bell,
  Settings,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Share2,
  HelpCircle,
} from 'lucide-react';

const DEFAULT_SETTINGS: ReminderSettings = {
  intervalMinutes: 5, // Default 5 minutes as requested
  soundEnabled: true,
  vibrationEnabled: true,
  notificationsEnabled: true,
  wakeLockEnabled: false,
  autoRotateCards: true,
  selectedCardId: 'ibrahimiyyah',
};

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function App() {
  // Settings state
  const [settings, setSettings] = useState<ReminderSettings>(() => {
    try {
      const saved = localStorage.getItem('salawat_settings_v1');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Stats state
  const [stats, setStats] = useState<SalawatStats>(() => {
    const today = getTodayString();
    try {
      const saved = localStorage.getItem('salawat_stats_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lastDate !== today) {
          return {
            totalCount: parsed.totalCount || 0,
            todayCount: 0,
            lastDate: today,
            streakDays: (parsed.streakDays || 0) + 1,
          };
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return {
      totalCount: 0,
      todayCount: 0,
      lastDate: today,
      streakDays: 1,
    };
  });

  // Timer state
  const totalSeconds = settings.intervalMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState<number>(totalSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Modal and Cards state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [activePreviewCard, setActivePreviewCard] = useState<SalawatCard | null>(null);

  // WakeLock Ref
  const wakeLockRef = useRef<any>(null);

  // Save settings
  useEffect(() => {
    try {
      localStorage.setItem('salawat_settings_v1', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Save stats
  useEffect(() => {
    try {
      localStorage.setItem('salawat_stats_v1', JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  // Update timer when interval changes
  useEffect(() => {
    setSecondsLeft(settings.intervalMinutes * 60);
  }, [settings.intervalMinutes]);

  // Active card calculation
  const activeCard: SalawatCard =
    activePreviewCard ||
    (settings.selectedCardId
      ? SALAWAT_CARDS.find((c) => c.id === settings.selectedCardId) || SALAWAT_CARDS[currentCardIndex]
      : SALAWAT_CARDS[currentCardIndex]);

  // Trigger popup reminder function
  const triggerReminder = (customCard?: SalawatCard) => {
    const cardToDisplay = customCard || activeCard;

    // Audio chime
    if (settings.soundEnabled) {
      playSpiritualChime();
    }

    // Phone vibration
    if (settings.vibrationEnabled) {
      triggerVibration([250, 100, 250]);
    }

    // Web Notification
    if (settings.notificationsEnabled && isNotificationSupported()) {
      sendSalawatNotification(
        'ﷺ الصلاة على النبي محمد ﷺ',
        `${cardToDisplay.arabicText}\n${cardToDisplay.virtueDescription}`,
        cardToDisplay.imagePath
      );
    }

    // Open visual popup modal
    if (customCard) {
      setActivePreviewCard(customCard);
    }
    setIsReminderModalOpen(true);

    // Reset countdown
    setSecondsLeft(settings.intervalMinutes * 60);

    // If auto-rotate, advance to next card
    if (settings.autoRotateCards && !customCard) {
      setCurrentCardIndex((prev) => (prev + 1) % SALAWAT_CARDS.length);
    }
  };

  // Timer Tick Effect
  useEffect(() => {
    if (!isTimerRunning) return;

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Timer reached 0: fire reminder!
          triggerReminder();
          return settings.intervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isTimerRunning, settings.intervalMinutes, settings.soundEnabled, settings.vibrationEnabled, settings.notificationsEnabled, settings.autoRotateCards, currentCardIndex]);

  // Screen WakeLock handling
  useEffect(() => {
    const manageWakeLock = async () => {
      if (settings.wakeLockEnabled && 'wakeLock' in navigator) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        } catch (err) {
          console.warn('Wake Lock request failed:', err);
        }
      } else if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
        } catch {
          // ignore
        }
      }
    };

    manageWakeLock();

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [settings.wakeLockEnabled]);

  // Counter Handlers
  const handleIncrementCount = (amount: number = 1) => {
    const today = getTodayString();
    setStats((prev) => ({
      ...prev,
      totalCount: prev.totalCount + amount,
      todayCount: prev.lastDate === today ? prev.todayCount + amount : amount,
      lastDate: today,
    }));
  };

  const handleResetTodayCount = () => {
    if (window.confirm('هل تريد تصفير عداد صلوات اليوم؟ (المجموع الكلي سيبقى محفوظاً)')) {
      setStats((prev) => ({
        ...prev,
        todayCount: 0,
      }));
    }
  };

  const handleUpdateSettings = (newSettings: Partial<ReminderSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handlePreviewCard = (card: SalawatCard) => {
    setActivePreviewCard(card);
    setIsReminderModalOpen(true);
  };

  const handleCloseReminderModal = () => {
    setIsReminderModalOpen(false);
    setActivePreviewCard(null);
  };

  const handleSelectCard = (card: SalawatCard) => {
    setSettings((prev) => ({
      ...prev,
      selectedCardId: card.id,
      autoRotateCards: false,
    }));
  };

  return (
    <div className="min-h-screen bg-[#071712] text-[#f2f7f4] flex flex-col justify-between selection:bg-amber-400 selection:text-emerald-950 font-cairo">
      {/* PWA Install Notification Bar */}
      <PWAInstallBanner />

      {/* Top Application Header */}
      <header className="sticky top-0 z-30 bg-[#09221a]/90 backdrop-blur-md border-b border-emerald-800/50 px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#071f17] rounded-[14px] flex items-center justify-center text-amber-300 font-amiri font-bold text-lg">
                ﷺ
              </div>
            </div>

            <div>
              <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                الصلاة على النبي ﷺ
              </h1>
              <p className="text-[11px] text-emerald-300">
                تذكير تلقائي كل {settings.intervalMinutes} دقائق
              </p>
            </div>
          </div>

          {/* Quick Header Controls */}
          <div className="flex items-center gap-2">
            <button
              id="header-sound-toggle-btn"
              onClick={() => handleUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              title={settings.soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
              className="p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 transition"
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            <button
              id="header-settings-btn"
              onClick={() => setIsSettingsModalOpen(true)}
              title="إعدادات التذكير"
              className="p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 transition"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full px-4 py-6 space-y-6 flex-1">
        {/* Prophet Muhammad Salawat Hadith Quote of the day */}
        <section
          id="featured-hadith-banner"
          aria-label="حديث شريف في فضل الصلاة على النبي"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-[#0b291f] to-emerald-950 border border-amber-500/30 p-4 sm:p-5 shadow-lg"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-amber-300 mb-1 font-cairo">
                بشارة نبوية كريمة
              </h2>
              <p className="text-sm sm:text-base text-amber-100 font-amiri font-bold leading-relaxed">
                « مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا »
              </p>
              <span className="text-[11px] text-emerald-300/80 mt-1 block">
                رواه الإمام مسلم في صحيحه
              </span>
            </div>
          </div>
        </section>

        {/* Countdown Timer Module */}
        <CountdownTimer
          secondsLeft={secondsLeft}
          totalSeconds={totalSeconds}
          isRunning={isTimerRunning}
          onTogglePlay={() => setIsTimerRunning(!isTimerRunning)}
          onReset={() => setSecondsLeft(totalSeconds)}
          onTriggerNow={() => triggerReminder()}
          intervalMinutes={settings.intervalMinutes}
        />

        {/* Interactive Tasbeeh Counter */}
        <TasbeehCounter
          stats={stats}
          onIncrement={handleIncrementCount}
          onResetToday={handleResetTodayCount}
        />

        {/* Cards Gallery for Browsing & Selecting Formula */}
        <CardsGallery
          cards={SALAWAT_CARDS}
          selectedCardId={settings.selectedCardId}
          onSelectCard={handleSelectCard}
          onPreviewCard={handlePreviewCard}
        />
      </main>

      {/* Footer */}
      <footer className="bg-[#05130e] border-t border-emerald-900/60 px-4 py-5 text-center text-xs text-emerald-400/80 space-y-2">
        <p className="font-amiri text-sm text-amber-200/90">
          اللهم صلِّ وسلم وبارك على سيدنا وحبيبنا ونبينا محمد وعلى آله وصحبه أجمعين
        </p>
        <p className="text-[11px] text-emerald-500">
          تطبيق الصلاة على النبي ﷺ • تثبيت PWA للهاتف • تذكير مستمر كل {settings.intervalMinutes} دقائق
        </p>
      </footer>

      {/* Active 5-Minute Reminder Modal Popup */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={handleCloseReminderModal}
        card={activeCard}
        onIncrementCount={handleIncrementCount}
        intervalMinutes={settings.intervalMinutes}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Offline Status Badge */}
      <OfflineIndicator />
    </div>
  );
}
