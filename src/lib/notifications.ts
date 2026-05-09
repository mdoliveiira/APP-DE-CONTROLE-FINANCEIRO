export async function requestPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendNotification(
  title: string,
  options?: NotificationOptions & { url?: string }
): void {
  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission !== 'granted') {
    return;
  }

  const notification = new Notification(title, {
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    ...options,
  });

  if (options?.url) {
    notification.onclick = () => {
      window.open(options.url, '_self');
    };
  }
}
