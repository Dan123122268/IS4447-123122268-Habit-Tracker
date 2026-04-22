import HabitLogForm from '@/components/HabitLogForm';
import HabitLogList from '@/components/HabitLogList';
import InfoTag from '@/components/ui/info-tag';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import SectionCard from '@/components/ui/section-card';
import { Colors, Spacing } from '@/constants/theme';
import { useTrackify } from '@/context/TrackifyContext';
import { db } from '@/db/client';
import { habitLogs as habitLogsTable, habits as habitsTable } from '@/db/schema';
import { HabitLog } from '@/types/trackify';
import { todayIso, totalForCurrentWeek } from '@/utils/date';
import { eq } from 'drizzle-orm';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { activeUser, categories, colors, habits, logs, targets, refreshData } = useTrackify();
  const [editingLog, setEditingLog] = useState<HabitLog | null>(null);
  const habitId = Number(id);
  const habit = habits.find((item) => item.id === habitId);

  if (!habit) return null;

  const category = categories.find((item) => item.id === habit.categoryId);
  const habitLogs = logs
    .filter((log) => log.habitId === habit.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const weeklyTarget = targets.find(
    (target) => target.habitId === habit.id && target.period === 'weekly'
  );
  const weeklyTotal = totalForCurrentWeek(habit.id, logs);
  const remaining = weeklyTarget
    ? Math.max(weeklyTarget.targetValue - weeklyTotal, 0)
    : 0;

  const logToday = async () => {
    if (!activeUser) return;

    await saveLog({
      date: todayIso(),
      value: 1,
      notes: null,
    });
  };

  const saveLog = async (input: { date: string; value: number; notes: string | null }) => {
    if (!activeUser) return;

    if (editingLog) {
      await db
        .update(habitLogsTable)
        .set({
          date: input.date,
          value: input.value,
          notes: input.notes,
        })
        .where(eq(habitLogsTable.id, editingLog.id));

      setEditingLog(null);
      await refreshData();
      return;
    }

    await db.insert(habitLogsTable).values({
      habitId: habit.id,
      userId: activeUser.id,
      date: input.date,
      value: input.value,
      completed: true,
      notes: input.notes,
    });

    await refreshData();
  };

  const deleteLog = async (logId: number) => {
    if (editingLog?.id === logId) {
      setEditingLog(null);
    }

    await db.delete(habitLogsTable).where(eq(habitLogsTable.id, logId));
    await refreshData();
  };

  const deleteHabit = async () => {
    await db.delete(habitsTable).where(eq(habitsTable.id, habit.id));
    await refreshData();
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title={habit.name} subtitle="Habit details" />

        <View style={styles.tags}>
          <InfoTag label="Category" value={category?.name ?? 'None'} />
          <InfoTag label="Metric" value={habit.metricType} />
        </View>

        <SectionCard>
          <Text style={[styles.summaryLabel, { color: colors.mutedText }]}>Weekly progress</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {weeklyTarget ? `${weeklyTotal}/${weeklyTarget.targetValue}` : weeklyTotal}
          </Text>
          <Text style={[styles.summaryHint, { color: colors.mutedText }]}>
            {weeklyTarget
              ? remaining === 0
                ? 'Target reached or exceeded'
                : `${remaining} remaining this week`
              : 'No weekly target set yet'}
          </Text>
        </SectionCard>

        {habit.notes ? <Text style={[styles.notes, { color: colors.text }]}>{habit.notes}</Text> : null}

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

        <View style={styles.formSpacing}>
          <HabitLogForm
            initialLog={editingLog}
            onCancel={() => setEditingLog(null)}
            onSave={saveLog}
          />
        </View>

        <HabitLogList logs={habitLogs} onEdit={setEditingLog} onDelete={deleteLog} />

        <View style={styles.buttonSpacing}>
          <PrimaryButton label="Delete Habit" variant="danger" onPress={deleteHabit} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    alignSelf: 'center',
    backgroundColor: Colors.light.background,
    flex: 1,
    maxWidth: 780,
    padding: Spacing.xl,
    width: '100%',
  },
  content: {
    paddingBottom: Spacing.xxl,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 34,
    fontWeight: '800',
    marginTop: Spacing.xs,
  },
  summaryHint: {
    marginTop: Spacing.xs,
  },
  notes: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: Spacing.lg,
  },
  buttonSpacing: {
    marginTop: Spacing.sm,
  },
  formSpacing: {
    marginTop: Spacing.xxl,
  },
});
