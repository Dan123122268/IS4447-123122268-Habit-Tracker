import DateRangeFilter from '@/components/DateRangeFilter';
import DashboardSummary from '@/components/DashboardSummary';
import HabitCard from '@/components/HabitCard';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useTrackify } from '@/context/TrackifyContext';
import { DateRangeFilter as DateRangeFilterValue, habitHasLogInDateRange } from '@/utils/filters';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IndexScreen() {
  const router = useRouter();
  const trackify = useTrackify();
  const {
    categories,
    habits,
    logs,
    targets,
    isLoading,
  } = trackify;
  const colors = trackify.colors ?? Colors.light;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeFilterValue>('all');

  const activeHabits = habits.filter((habit) => !habit.isArchived);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredHabits = activeHabits.filter((habit) => {
    const category = categories.find((item) => item.id === habit.categoryId);
    const matchesSearch =
      normalizedQuery.length === 0 ||
      habit.name.toLowerCase().includes(normalizedQuery) ||
      category?.name.toLowerCase().includes(normalizedQuery) ||
      habit.notes?.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      selectedCategoryId === null || habit.categoryId === selectedCategoryId;

    const matchesDateRange = habitHasLogInDateRange(habit, logs, dateRange);

    return matchesSearch && matchesCategory && matchesDateRange;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Trackify"
        subtitle={`${activeHabits.length} active habits`}
      />

      <PrimaryButton
        label="Add Habit"
        onPress={() => router.push({ pathname: '/add' })}
      />

      <DashboardSummary habits={activeHabits} logs={logs} />

      <TextInput
        accessibilityLabel="Search habits"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search habits or categories"
        placeholderTextColor={colors.mutedText}
        style={[
          styles.searchInput,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
      />

      <View style={styles.filterRow}>
        <Pressable
          accessibilityLabel="Show all categories"
          accessibilityRole="button"
          onPress={() => setSelectedCategoryId(null)}
          style={[
            styles.filterButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            selectedCategoryId === null && {
              backgroundColor: colors.tint,
              borderColor: colors.tint,
            },
          ]}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: colors.text },
              selectedCategoryId === null && styles.filterButtonTextSelected,
            ]}
          >
            All
          </Text>
        </Pressable>

        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;

          return (
            <Pressable
              key={category.id}
              accessibilityLabel={`Filter by ${category.name}`}
              accessibilityRole="button"
              onPress={() => setSelectedCategoryId(category.id)}
              style={[
                styles.filterButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
                isSelected && { backgroundColor: category.colour, borderColor: category.colour },
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  { color: colors.text },
                  isSelected && styles.filterButtonTextSelected,
                ]}
              >
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <DateRangeFilter value={dateRange} onChange={setDateRange} />

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Text style={[styles.emptyText, { color: colors.mutedText }]}>Loading habits...</Text>
        ) : filteredHabits.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.mutedText }]}>
            No habits match your search, category, and date filters
          </Text>
        ) : (
          filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              category={categories.find((category) => category.id === habit.categoryId)}
              logs={logs}
              target={targets.find(
                (target) => target.habitId === habit.id && target.period === 'weekly'
              )}
            />
          ))
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
    paddingHorizontal: 18,
    paddingTop: 10,
    width: '100%',
  },
  listContent: {
    paddingBottom: Spacing.screenBottom,
    paddingTop: Spacing.lg,
  },
  searchInput: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    color: Colors.light.text,
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    minHeight: 44,
    paddingTop: Spacing.md,
  },
  filterButton: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterButtonTextSelected: {
    color: Colors.light.surface,
  },
  emptyText: {
    fontSize: 16,
    paddingTop: Spacing.sm,
    textAlign: 'center',
  },
});
