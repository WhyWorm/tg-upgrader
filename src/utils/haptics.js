// Telegram Mini App Haptic Feedback with fallbacks
export const haptics = {
  impact: (style = 'medium') => {
    try {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
        return;
      }
      if (navigator.vibrate) {
        if (style === 'light') navigator.vibrate(10);
        else if (style === 'medium') navigator.vibrate(25);
        else if (style === 'heavy') navigator.vibrate(45);
      }
    } catch (e) {}
  },

  notification: (type = 'success') => {
    try {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
        return;
      }
      if (navigator.vibrate) {
        if (type === 'success') navigator.vibrate([20, 40, 30]);
        else if (type === 'error') navigator.vibrate([40, 30, 60]);
        else navigator.vibrate(20);
      }
    } catch (e) {}
  },

  selection: () => {
    try {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.selectionChanged();
        return;
      }
      if (navigator.vibrate) {
        navigator.vibrate(8);
      }
    } catch (e) {}
  }
};
