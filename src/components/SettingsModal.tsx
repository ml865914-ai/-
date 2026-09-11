import React from 'react';
import { ReminderSettings } from '../types';
import { requestNotificationPermission, getNotificationPermission } from '../utils/notification';
import { playSpiritualChime, triggerVibration } from '../utils/audio';
import { Settings, Bell, Volume2, Vibrate, Sun, X, Shuffle, CheckCircle, Clock } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReminderSettings;
  onUpdateSettings: (newSettings: Partial<ReminderSettings>) => void;
}

const INTERVAL_OPTIONS = [
  { value: 1, label: 'دقيقة واحدة (للتجربة السريعة)' },
  { value: 3, label: '3 دقائق' },
  { value: 5, label: '5 دقائق (الافتراضي الموصى به)' },
  { value: 10, label: '10 دقائق' },
  { value: 15, label: '15 دقيقة' },
  { value: 30, label: '30 دقيقة' },
  { value: 60, label: 'ساعة كاملة' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const currentPermission = getNotificationPermission();

  const handleRequestNotification = async () => {
    const granted = await requestNotificationPermission();
    onUpdateSettings({ notificationsEnabled: granted });
  };

  const handleTestSound = () => {
    playSpiritualChime();
    triggerVibration();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div
        id="app-settings-modal"
        className="relative w-full max-w-md rounded-3xl bg-[#0a231b] border border-emerald-700/60 p-6 shadow-2xl text-right text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-800/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-800/50 text-amber-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-cairo text-white">إعدادات التذكير</h3>
              <p className="text-xs text-emerald-300">تخصيص وقت وأسلوب التنبيهات</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-emerald-400 hover:text-white hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {/* Interval Frequency */}
          <div>
            <label className="block text-xs font-semibold text-emerald-200 mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              تكرار ظهور التذكير المنبثق:
            </label>
            <select
              id="reminder-interval-select"
              value={settings.intervalMinutes}
              onChange={(e) => onUpdateSettings({ intervalMinutes: Number(e.target.value) })}
              className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/70 text-emerald-100 font-medium text-sm focus:outline-none focus:border-amber-400"
            >
              {INTERVAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-emerald-400/80 mt-1.5">
              التطبيق مضبوط افتراضياً على كل 5 دقائق تلبيةً لطلبك.
            </p>
          </div>

          {/* Audio Chime */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-900 text-amber-300">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">صوت التنبيه الهادئ</p>
                <p className="text-xs text-emerald-300/80">رنة إيمانية روحية خفيفة عند التذكير</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTestSound}
                className="text-xs px-2.5 py-1 bg-emerald-800/70 hover:bg-emerald-700 text-emerald-200 rounded-lg"
              >
                تجربة
              </button>
              <input
                type="checkbox"
                id="sound-toggle"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Vibration */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-900 text-amber-300">
                <Vibrate className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">اهتزاز الهاتف</p>
                <p className="text-xs text-emerald-300/80">تنبيه بالاهتزاز على الهواتف المتوافقة</p>
              </div>
            </div>

            <input
              type="checkbox"
              id="vibration-toggle"
              checked={settings.vibrationEnabled}
              onChange={(e) => onUpdateSettings({ vibrationEnabled: e.target.checked })}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Browser / System Notifications */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-900 text-amber-300">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">إشعارات الهاتف / النظام</p>
                <p className="text-xs text-emerald-300/80">
                  {currentPermission === 'granted'
                    ? 'صلاحية الإشعارات مفعّلة بنجاح'
                    : 'لتلقي التنبيهات حتى عند تصغير المتصفح'}
                </p>
              </div>
            </div>

            {currentPermission === 'granted' ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                <CheckCircle className="w-4 h-4" />
                مُفعّل
              </span>
            ) : (
              <button
                onClick={handleRequestNotification}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 transition"
              >
                تفعيل الإشعارات
              </button>
            )}
          </div>

          {/* Auto Rotate Cards */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-900 text-amber-300">
                <Shuffle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">تنويع صور وبطاقات الصلاة</p>
                <p className="text-xs text-emerald-300/80">إظهار صيغة وحديث مختلف في كل تذكير</p>
              </div>
            </div>

            <input
              type="checkbox"
              id="autorotate-toggle"
              checked={settings.autoRotateCards}
              onChange={(e) => onUpdateSettings({ autoRotateCards: e.target.checked })}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Screen Keep Awake */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-900 text-amber-300">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">إبقاء الشاشة نشطة (Wake Lock)</p>
                <p className="text-xs text-emerald-300/80">لمنع إغلاق الشاشة أثناء فتح التطبيق</p>
              </div>
            </div>

            <input
              type="checkbox"
              id="wakelock-toggle"
              checked={settings.wakeLockEnabled}
              onChange={(e) => onUpdateSettings({ wakeLockEnabled: e.target.checked })}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md transition"
        >
          حفظ وإغلاق
        </button>
      </div>
    </div>
  );
};
