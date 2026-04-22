import InfoTag from '@/components/ui/info-tag';
import ChoiceChip from '@/components/ui/choice-chip';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import SectionCard from '@/components/ui/section-card';
import { Colors, Spacing } from '@/constants/theme';
import { useTrackify } from '@/context/TrackifyContext';
import { exportHabitLogsCsv } from '@/utils/export';
import { cancelHabitReminder, scheduleDailyHabitReminder } from '@/utils/reminders';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    activeUser,
    categories,
    colors,
    deleteProfile,
    habits,
    logs,
    logout,
    settings,
    setThemeMode,
    setUserSetting,
    targets,
    themeMode,
  } = useTrackify();
  const [exportMessage, setExportMessage] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');
  const [isUpdatingReminder, setIsUpdatingReminder] = useState(false);
  const reminderId = settings.find((setting) => setting.key === 'reminder_notification_id')?.value;
  const reminderTime = settings.find((setting) => setting.key === 'reminder_time')?.value ?? '20:00';

  const handleLogout = async () => {
    await logout();
    router.replace('/login' as Href);
  };

  const handleDeleteProfile = async () => {
    await deleteProfile();
    router.replace('/register' as Href);
  };

  const handleExport = async () => {
    if (!activeUser) return;

    setIsExporting(true);
    setExportMessage('');

    try {
      const fileUri = await exportHabitLogsCsv(activeUser, habits, categories, logs);
      setExportMessage(`Export ready: ${fileUri}`);
    } catch (error) {
      setExportMessage(error instanceof Error ? error.message : 'Unable to export CSV.');
    } finally {
      setIsExporting(false);
    }
  };

  const enableReminder = async () => {
    setIsUpdatingReminder(true);
    setReminderMessage('');

    try {
      const identifier = await scheduleDailyHabitReminder(20, 0);
      await setUserSetting('reminder_notification_id', identifier);
      await setUserSetting('reminder_time', '20:00');
      setReminderMessage('Daily reminder scheduled for 20:00.');
    } catch (error) {
      setReminderMessage(
        error instanceof Error ? error.message : 'Unable to schedule reminder.'
      );
    } finally {
      setIsUpdatingReminder(false);
    }
  };

  const disableReminder = async () => {
    setIsUpdatingReminder(true);
    setReminderMessage('');

    try {
      await cancelHabitReminder(reminderId);
      await setUserSetting('reminder_notification_id', null);
      await setUserSetting('reminder_time', null);
      setReminderMessage('Daily reminder disabled.');
    } catch (error) {
      setReminderMessage(error instanceof Error ? error.message : 'Unable to disable reminder.');
    } finally {
      setIsUpdatingReminder(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Profile" subtitle="Local-only account and data controls." />

        {!activeUser ? (
          <SectionCard>
            <Text style={styles.emptyText}>No profile is currently logged in.</Text>
            <View style={styles.buttonSpacing}>
              <PrimaryButton label="Login" onPress={() => router.replace('/login' as Href)} />
            </View>
          </SectionCard>
        ) : (
          <>
            <SectionCard>
              <Text style={styles.username}>{activeUser.username}</Text>
              <Text style={styles.meta}>Created {activeUser.createdAt}</Text>
              <View style={styles.tags}>
                <InfoTag label="Habits" value={String(habits.length)} />
                <InfoTag label="Logs" value={String(logs.length)} />
                <InfoTag label="Targets" value={String(targets.length)} />
                <InfoTag label="Categories" value={String(categories.length)} />
              </View>
            </SectionCard>

            <SectionCard>
              <Text style={styles.sectionTitle}>Privacy</Text>
              <Text style={styles.meta}>
                Trackify stores habit data locally on this device using SQLite. No backend
                account, API secret, or remote database is used.
              </Text>
            </SectionCard>

            <SectionCard>
              <Text style={styles.sectionTitle}>Data export</Text>
              <Text style={styles.meta}>
                Export your stored habit logs as a CSV file that can be saved or shared locally.
              </Text>
              {exportMessage ? (
                <Text style={styles.exportMessage}>{exportMessage}</Text>
              ) : null}
              <View style={styles.buttonSpacing}>
                <PrimaryButton
                  label={isExporting ? 'Exporting...' : 'Export CSV'}
                  variant="secondary"
                  onPress={handleExport}
                />
              </View>
            </SectionCard>

            <SectionCard>
              <Text style={styles.sectionTitle}>Theme</Text>
              <Text style={styles.meta}>Your display preference is stored locally.</Text>
              <View style={styles.choiceRow}>
                <ChoiceChip
                  label="System"
                  selected={themeMode === 'system'}
                  onPress={() => void setThemeMode('system')}
                />
                <ChoiceChip
                  label="Light"
                  selected={themeMode === 'light'}
                  onPress={() => void setThemeMode('light')}
                />
                <ChoiceChip
                  label="Dark"
                  selected={themeMode === 'dark'}
                  onPress={() => void setThemeMode('dark')}
                  colour={colors.tint}
                />
              </View>
            </SectionCard>

            <SectionCard>
              <Text style={styles.sectionTitle}>Reminders</Text>
              <Text style={styles.meta}>
                {reminderId
                  ? `Daily habit reminder is enabled for ${reminderTime}.`
                  : 'Schedule a local daily reminder to log habit progress.'}
              </Text>
              {reminderMessage ? (
                <Text style={styles.exportMessage}>{reminderMessage}</Text>
              ) : null}
              <View style={styles.buttonSpacing}>
                <PrimaryButton
                  label={
                    isUpdatingReminder
                      ? 'Updating...'
                      : reminderId
                        ? 'Disable Reminder'
                        : 'Enable 20:00 Reminder'
                  }
                  variant={reminderId ? 'danger' : 'secondary'}
                  onPress={reminderId ? disableReminder : enableReminder}
                />
              </View>
            </SectionCard>

            <PrimaryButton label="Logout" variant="secondary" onPress={handleLogout} />
            <View style={styles.buttonSpacing}>
              <PrimaryButton
                label="Delete Profile"
                variant="danger"
                onPress={handleDeleteProfile}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.light.background,
    flex: 1,
    padding: Spacing.xl,
  },
  content: {
    paddingBottom: Spacing.xxl,
  },
  username: {
    color: Colors.light.text,
    fontSize: 26,
    fontWeight: '900',
  },
  meta: {
    color: Colors.light.mutedText,
    fontSize: 14,
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.lg,
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    color: Colors.light.mutedText,
  },
  exportMessage: {
    color: Colors.light.mutedText,
    fontSize: 12,
    marginTop: Spacing.md,
  },
  buttonSpacing: {
    marginTop: Spacing.sm,
  },
});
