import ProgressBar from '@/components/ui/progress-bar';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { Category, Habit, HabitLog, Target } from '@/types/trackify';
import { totalForCurrentWeek } from '@/utils/date';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  habit: Habit;
  category?: Category;
  logs: HabitLog[];
  target?: Target;
};

const legacyIconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  activity: 'fitness-outline',
  book: 'book-outline',
  'book-open': 'book-outline',
  heart: 'heart-outline',
  moon: 'moon-outline',
  target: 'radio-button-on-outline',
};

export default function HabitCard({ habit, category, logs, target }: Props) {
  const colors = useThemeColors();
  const router = useRouter();
  const weeklyTotal = totalForCurrentWeek(habit.id, logs);
  const targetValue = target?.targetValue ?? 0;
  const progress = targetValue > 0 ? weeklyTotal / targetValue : 0;
  const categoryColour = category?.colour ?? Colors.light.tint;
  const iconName =
    legacyIconMap[category?.icon ?? ''] ??
    ((category?.icon ?? 'checkmark-circle-outline') as keyof typeof Ionicons.glyphMap);

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
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: `${categoryColour}22` }]}>
          <Ionicons name={iconName} size={21} color={categoryColour} />
        </View>
        <View style={styles.titleBlock}>
          <Text style={[styles.name, { color: colors.text }]}>{habit.name}</Text>
          <Text style={[styles.category, { color: colors.mutedText }]}>
            {category?.name ?? 'No category'}
          </Text>
        </View>
        <Text
          style={[
            styles.statusPill,
            {
              backgroundColor: colors.surfaceStrong,
              color: categoryColour,
            },
          ]}
        >
          {target && weeklyTotal >= target.targetValue ? 'Done' : 'Active'}
        </Text>
      </View>

      <View style={styles.progressHeader}>
        <Text style={[styles.progressLabel, { color: colors.mutedText }]}>This week</Text>
        <Text style={[styles.progressValue, { color: colors.text }]}>
          {target ? `${weeklyTotal}/${target.targetValue}` : `${weeklyTotal} logged`}
        </Text>
      </View>
      <ProgressBar progress={target ? progress : weeklyTotal > 0 ? 1 : 0} colour={categoryColour} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    elevation: 2,
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
  titleBlock: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  category: {
    fontSize: 13,
    marginTop: 2,
  },
  statusPill: {
    borderRadius: Radius.pill,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  progressLabel: {
    fontSize: 13,
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '700',
  },
});

