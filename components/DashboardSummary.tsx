import SectionCard from '@/components/ui/section-card';
import { Spacing } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { Habit, HabitLog } from '@/types/trackify';
import { isCurrentWeek } from '@/utils/date';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  habits: Habit[];
  logs: HabitLog[];
};

export default function DashboardSummary({ habits, logs }: Props) {
  const colors = useThemeColors();
  const weeklyTotal = logs
    .filter((log) => isCurrentWeek(log.date))
    .reduce((total, log) => total + log.value, 0);

  return (
    <View style={styles.grid}>
      <SectionCard>
        <Text style={[styles.value, { color: colors.text }]}>{habits.length}</Text>
        <Text style={[styles.label, { color: colors.mutedText }]}>active habits</Text>
      </SectionCard>
      <SectionCard>
        <Text style={[styles.value, { color: colors.text }]}>{weeklyTotal}</Text>
        <Text style={[styles.label, { color: colors.mutedText }]}>logged this week</Text>
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
    fontSize: 30,
    fontWeight: '900',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
});

