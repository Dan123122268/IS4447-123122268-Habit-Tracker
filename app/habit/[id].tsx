import InfoTag from '@/components/ui/info-tag';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useTrackify } from '@/context/TrackifyContext';
import { db } from '@/db/client';
import { habitLogs as habitLogsTable, habits as habitsTable } from '@/db/schema';
import { formatDateLabel, todayIso, totalForCurrentWeek } from '@/utils/date';
import { eq } from 'drizzle-orm';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { activeUser, categories, habits, logs, targets, refreshData } = useTrackify();
  const habitId = Number(id);
  const habit = habits.find((item) => item.id === habitId);

  if (!habit) return null;

  const category = categories.find((item) => item.id === habit.categoryId);
  const habitLogs = logs
    .filter((log) => log.habitId === habit.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
  const weeklyTarget = targets.find(
    (target) => target.habitId === habit.id && target.period === 'weekly'
  );
  const weeklyTotal = totalForCurrentWeek(habit.id, logs);
  const remaining = weeklyTarget
    ? Math.max(weeklyTarget.targetValue - weeklyTotal, 0)
    : 0;

  const logToday = async () => {
    if (!activeUser) return;

    await db.insert(habitLogsTable).values({
      habitId: habit.id,
      userId: activeUser.id,
      date: todayIso(),
      value: 1,
      completed: true,
      notes: null,
    });

    await refreshData();
  };

  const deleteHabit = async () => {
    await db.delete(habitsTable).where(eq(habitsTable.id, habit.id));
    await refreshData();
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title={habit.name} subtitle="Habit details" />

        <View style={styles.tags}>
          <InfoTag label="Category" value={category?.name ?? 'None'} />
          <InfoTag label="Metric" value={habit.metricType} />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Weekly progress</Text>
          <Text style={styles.summaryValue}>
            {weeklyTarget ? `${weeklyTotal}/${weeklyTarget.targetValue}` : weeklyTotal}
          </Text>
          <Text style={styles.summaryHint}>
            {weeklyTarget
              ? remaining === 0
                ? 'Target reached or exceeded'
                : `${remaining} remaining this week`
              : 'No weekly target set yet'}
          </Text>
        </View>

        {habit.notes ? <Text style={styles.notes}>{habit.notes}</Text> : null}

        <PrimaryButton label="Log Today" onPress={logToday} />
        <View style={styles.buttonSpacing}>
          <PrimaryButton
            label="Edit Habit"
            variant="secondary"
            onPress={() =>
              router.push(({
                pathname: '/habit/[id]/edit',
                params: { id },
              } as unknown) as Href)
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent logs</Text>
          {habitLogs.length === 0 ? (
            <Text style={styles.emptyText}>No logs yet. Log today to start your streak.</Text>
          ) : (
            habitLogs.map((log) => (
              <View key={log.id} style={styles.logRow}>
                <Text style={styles.logDate}>{formatDateLabel(log.date)}</Text>
                <Text style={styles.logValue}>{log.value}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.buttonSpacing}>
          <PrimaryButton label="Delete Habit" variant="danger" onPress={deleteHabit} />
        </View>
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
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
  },
  summaryCard: {
    backgroundColor: Colors.light.surface,
    borderColor: '#E2E8F0',
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
  },
  summaryLabel: {
    color: Colors.light.mutedText,
    fontSize: 13,
    fontWeight: '600',
  },
  summaryValue: {
    color: Colors.light.text,
    fontSize: 34,
    fontWeight: '800',
    marginTop: Spacing.xs,
  },
  summaryHint: {
    color: Colors.light.mutedText,
    marginTop: Spacing.xs,
  },
  notes: {
    color: Colors.light.text,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: Spacing.lg,
  },
  buttonSpacing: {
    marginTop: Spacing.sm,
  },
  section: {
    marginTop: Spacing.xxl,
  },
  sectionTitle: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  emptyText: {
    color: Colors.light.mutedText,
  },
  logRow: {
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    padding: Spacing.md,
  },
  logDate: {
    color: Colors.light.text,
    fontWeight: '600',
  },
  logValue: {
    color: Colors.light.tint,
    fontWeight: '800',
  },
});
