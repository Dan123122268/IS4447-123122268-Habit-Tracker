import ProgressBar from '@/components/ui/progress-bar';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { Category, Habit, HabitLog, Target } from '@/types/trackify';
import { totalForCurrentWeek } from '@/utils/date';
import { Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  habit: Habit;
  category?: Category;
  logs: HabitLog[];
  target?: Target;
};

export default function HabitCard({ habit, category, logs, target }: Props) {
  const router = useRouter();
  const weeklyTotal = totalForCurrentWeek(habit.id, logs);
  const targetValue = target?.targetValue ?? 0;
  const progress = targetValue > 0 ? weeklyTotal / targetValue : 0;
  const categoryColour = category?.colour ?? Colors.light.tint;

  return (
    <Pressable
      accessibilityLabel={`${habit.name}, ${category?.name ?? 'uncategorised'}, view details`}
      accessibilityRole="button"
      onPress={() =>
        router.push(({
          pathname: '/habit/[id]',
          params: { id: habit.id.toString() },
        } as unknown) as Href)
      }
      style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
    >
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: `${categoryColour}22` }]}>
          <Text style={[styles.iconText, { color: categoryColour }]}>
            {(category?.icon ?? habit.name).slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.name}>{habit.name}</Text>
          <Text style={styles.category}>{category?.name ?? 'No category'}</Text>
        </View>
      </View>

      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>This week</Text>
        <Text style={styles.progressValue}>
          {target ? `${weeklyTotal}/${target.targetValue}` : `${weeklyTotal} logged`}
        </Text>
      </View>
      <ProgressBar progress={target ? progress : weeklyTotal > 0 ? 1 : 0} colour={categoryColour} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderColor: '#E2E8F0',
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
  },
  cardPressed: {
    opacity: 0.88,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconBadge: {
    alignItems: 'center',
    borderRadius: Radius.md,
    height: 40,
    justifyContent: 'center',
    marginRight: Spacing.md,
    width: 40,
  },
  iconText: {
    fontSize: 16,
    fontWeight: '700',
  },
  titleBlock: {
    flex: 1,
  },
  name: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: '700',
  },
  category: {
    color: Colors.light.mutedText,
    fontSize: 13,
    marginTop: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  progressLabel: {
    color: Colors.light.mutedText,
    fontSize: 13,
  },
  progressValue: {
    color: Colors.light.text,
    fontSize: 13,
    fontWeight: '700',
  },
});
