export interface SalawatCard {
  id: string;
  title: string;
  arabicText: string;
  subtitle?: string;
  source: string;
  narrator?: string;
  virtueDescription: string;
  theme: 'emerald' | 'royal-blue' | 'golden' | 'night';
  imagePath?: string;
}

export interface ReminderSettings {
  intervalMinutes: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notificationsEnabled: boolean;
  wakeLockEnabled: boolean;
  autoRotateCards: boolean;
  selectedCardId?: string;
}

export interface SalawatStats {
  totalCount: number;
  todayCount: number;
  lastDate: string;
  streakDays: number;
}
