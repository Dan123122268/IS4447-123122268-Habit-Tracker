import SimpleBarChart from '@/components/SimpleBarChart';
import WellnessAdvice from '@/components/WellnessAdvice';
import ChoiceChip from '@/components/ui/choice-chip';
import ProgressBar from '@/components/ui/progress-bar';
import ScreenHeader from '@/components/ui/screen-header';
import SectionCard from '@/components/ui/section-card';
import { Colors, Spacing } from '@/constants/theme';
import { useTrackify } from '@/context/TrackifyContext';
import {
  buildDailyChart,
  buildMonthlyChart,
  buildWeeklyChart,
  calculateHabitStreak,
  completedLogCount,
  topHabitByVolume,
  totalLogged,
} from '@/utils/insights';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ViewMode = 'daily' | 'weekly' | 'monthly';

export default function InsightsScreen() {
  const { categories, colors, habits, logs, targets } = useTrackify();
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const activeHabits = habits.filter((habit) => !habit.isArchived);
  const topHabit = topHabitByVolume(activeHabits, logs);
  const chartData =
    viewMode === 'monthly'
      ? buildMonthlyChart(logs)
      : viewMode === 'weekly'
        ? buildWeeklyChart(logs)
        : buildDailyChart(logs);

  const streakRows = activeHabits
    .map((habit) => ({
      habit,
      category: categories.find((category) => category.id === habit.categoryId),
      streak: calculateHabitStreak(habit.id, logs),
    }))
    .sort((a, b) => b.streak - a.streak);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Insights"
          subtitle="Summaries and charts from stored habit logs."
        />

        <WellnessAdvice />

        <View style={styles.summaryGrid}>
          <SectionCard>
            <Text style={[styles.metricValue, { color: colors.text }]}>{totalLogged(logs)}</Text>
            <Text style={[styles.metricLabel, { color: colors.mutedText }]}>total logged</Text>
          </SectionCard>
          <SectionCard>
            <Text style={[styles.metricValue, { color: colors.text }]}>{completedLogCount(logs)}</Text>
            <Text style={[styles.metricLabel, { color: colors.mutedText }]}>completed entries</Text>
          </SectionCard>
        </View>

        <SectionCard>
          <View style={styles.chartHeader}>
            <View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Activity chart</Text>
              <Text style={[styles.cardHint, { color: colors.mutedText }]}>
                {viewMode} values calculated from stored logs.
              </Text>
            </View>
          </View>
          <View style={styles.chipRow}>
            <ChoiceChip
              label="Daily"
              selected={viewMode === 'daily'}
              onPress={() => setViewMode('daily')}
            />
            <ChoiceChip
              label="Weekly"
              selected={viewMode === 'weekly'}
              onPress={() => setViewMode('weekly')}
            />
            <ChoiceChip
              label="Monthly"
              selected={viewMode === 'monthly'}
              onPress={() => setViewMode('monthly')}
            />
          </View>
          {logs.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.mutedText }]}>
              Log a habit to generate chart data.
            </Text>
          ) : (
            <SimpleBarChart data={chartData} />
          )}
        </SectionCard>

        <SectionCard>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Top habit</Text>
          {topHabit && topHabit.total > 0 ? (
            <>
              <Text style={[styles.featureName, { color: colors.text }]}>
                {topHabit.habit.name}
              </Text>
              <Text style={[styles.cardHint, { color: colors.mutedText }]}>
                {topHabit.total} total logged
              </Text>
            </>
          ) : (
            <Text style={[styles.emptyText, { color: colors.mutedText }]}>No top habit yet.</Text>
          )}
        </SectionCard>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Streaks</Text>
        {streakRows.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.mutedText }]}>
            Create a habit to start tracking streaks.
          </Text>
        ) : (
          streakRows.map(({ habit, category, streak }) => {
            const target = targets.find(
              (item) => item.habitId === habit.id && item.period === 'weekly'
            );
            const progress = target ? Math.min(streak / target.targetValue, 1) : 0;

            return (
              <SectionCard key={habit.id}>
                <View style={styles.streakHeader}>
                  <View style={styles.streakText}>
                    <Text style={[styles.featureName, { color: colors.text }]}>{habit.name}</Text>
                    <Text style={[styles.cardHint, { color: colors.mutedText }]}>
                      {category?.name ?? 'No category'} - {streak} day streak
                    </Text>
                  </View>
                  <Text style={[styles.streakBadge, { color: category?.colour ?? colors.tint }]}>
                    {streak}
                  </Text>
                </View>
                <ProgressBar progress={target ? progress : streak > 0 ? 1 : 0} colour={category?.colour} />
              </SectionCard>
            );
          })
        )}
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
    paddingBottom: Spacing.screenBottom,
  },
  summaryGrid: {
    gap: Spacing.md,
  },
  metricValue: {
    color: Colors.light.text,
    fontSize: 34,
    fontWeight: '900',
  },
  metricLabel: {
    color: Colors.light.mutedText,
    fontSize: 13,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: '800',
  },
  cardHint: {
    color: Colors.light.mutedText,
    fontSize: 13,
    marginTop: 2,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  featureName: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  emptyText: {
    color: Colors.light.mutedText,
  },
  streakHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  streakText: {
    flex: 1,
  },
  streakBadge: {
    color: Colors.light.tint,
    fontSize: 28,
    fontWeight: '900',
  },
});
