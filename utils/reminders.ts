import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function scheduleDailyHabitReminder(hour = 20, minute = 0) {
  const currentPermissions = await Notifications.getPermissionsAsync();
  const finalPermissions = currentPermissions.granted
    ? currentPermissions
    : await Notifications.requestPermissionsAsync();

  if (!finalPermissions.granted) {
    throw new Error('Notifications permission was not granted.');
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Trackify reminder',
      body: 'Log today\'s habits and keep your streak alive.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelHabitReminder(identifier?: string) {
  if (!identifier) return;

  await Notifications.cancelScheduledNotificationAsync(identifier);
}
