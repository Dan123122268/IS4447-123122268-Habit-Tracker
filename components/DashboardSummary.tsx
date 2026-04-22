import SectionCard from '@/components/ui/section-card';
import { Colors, Spacing } from '@/constants/theme';
import { Habit, HabitLog } from '@/types/trackify';
import { isCurrentWeek } from '@/utils/date';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  habits: Habit[];
  logs: HabitLog[];
};

export default function DashboardSummary({ habits, logs }: Props) {
  const weeklyTotal = logs
    .filter((log) => isCurrentWeek(log.date))
    .reduce((total, log) => total + log.value, 0);

  return (
    <View style={styles.grid}>
      <SectionCard>
        <Text style={styles.value}>{habits.length}</Text>
        <Text style={styles.label}>active habits</Text>
      </SectionCard>
      <SectionCard>
        <Text style={styles.value}>{weeklyTotal}</Text>
        <Text style={styles.label}>logged this week</Text>
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  value: {
    color: Colors.light.text,
    fontSize: 30,
    fontWeight: '900',
  },
  label: {
    color: Colors.light.mutedText,
    fontSize: 13,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
});
