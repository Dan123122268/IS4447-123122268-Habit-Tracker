import HabitCard from '@/components/HabitCard';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useTrackify } from '@/context/TrackifyContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IndexScreen() {
  const router = useRouter();
  const { categories, habits, logs, targets, isLoading } = useTrackify();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

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

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Trackify"
        subtitle={`${activeHabits.length} active habits`}
      />

      <PrimaryButton
        label="Add Habit"
        onPress={() => router.push({ pathname: '/add' })}
      />

      <TextInput
        accessibilityLabel="Search habits"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search habits or categories"
        style={styles.searchInput}
      />

      <ScrollView
        horizontal
        contentContainerStyle={styles.filterRow}
        showsHorizontalScrollIndicator={false}
      >
        <Pressable
          accessibilityLabel="Show all categories"
          accessibilityRole="button"
          onPress={() => setSelectedCategoryId(null)}
          style={[
            styles.filterButton,
            selectedCategoryId === null && styles.filterButtonSelected,
          ]}
        >
          <Text
            style={[
              styles.filterButtonText,
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
                isSelected && { backgroundColor: category.colour, borderColor: category.colour },
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  isSelected && styles.filterButtonTextSelected,
                ]}
              >
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Text style={styles.emptyText}>Loading habits...</Text>
        ) : filteredHabits.length === 0 ? (
          <Text style={styles.emptyText}>No habits match your filters</Text>
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
    backgroundColor: Colors.light.background,
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.lg,
  },
  searchInput: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: Radius.lg,
    borderWidth: 1,
    color: Colors.light.text,
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  filterRow: {
    gap: Spacing.sm,
    paddingTop: Spacing.md,
  },
  filterButton: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  filterButtonSelected: {
    backgroundColor: Colors.light.text,
    borderColor: Colors.light.text,
  },
  filterButtonText: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: '600',
  },
  filterButtonTextSelected: {
    color: Colors.light.surface,
  },
  emptyText: {
    color: Colors.light.mutedText,
    fontSize: 16,
    paddingTop: Spacing.sm,
    textAlign: 'center',
  },
});
