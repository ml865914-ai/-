export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  try {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return false;
  }
}

export async function sendSalawatNotification(
  title: string = 'ﷺ تذكير: الصلاة على النبي محمد ﷺ',
  body: string = 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ أَجْمَعِينَ',
  image?: string
): Promise<void> {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  try {
    // If Service Worker registration exists, use showNotification for better mobile background support
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.showNotification(title, {
          body,
          icon: '/pwa-192x192.png',
          badge: '/icon.svg',
          image: image || '/images/salawat_green.jpg',
          vibrate: [200, 100, 200],
          tag: 'salawat-reminder',
          lang: 'ar',
          dir: 'rtl',
          requireInteraction: false,
        } as NotificationOptions);
        return;
      }
    }

    // Fallback standard web notification
    new Notification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/icon.svg',
      image: image || '/images/salawat_green.jpg',
      tag: 'salawat-reminder',
      dir: 'rtl',
      lang: 'ar',
    } as NotificationOptions & { image?: string });
  } catch (err) {
    console.warn('Could not display system notification:', err);
  }
}
