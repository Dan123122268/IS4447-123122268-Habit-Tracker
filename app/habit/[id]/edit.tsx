import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useTrackify } from '@/context/TrackifyContext';
import { db } from '@/db/client';
import { habits as habitsTable, targets as targetsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditHabit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { categories, colors, habits, targets, refreshData } = useTrackify();
  const habitId = Number(id);
  const habit = habits.find((item) => item.id === habitId);
  const weeklyTarget = targets.find(
    (target) => target.habitId === habitId && target.period === 'weekly'
  );
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [weeklyTargetValue, setWeeklyTargetValue] = useState('1');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!habit) return;

    setName(habit.name);
    setNotes(habit.notes ?? '');
    setCategoryId(habit.categoryId);
    setWeeklyTargetValue(String(weeklyTarget?.targetValue ?? 1));
  }, [habit, weeklyTarget]);

  if (!habit) return null;

  const saveChanges = async () => {
    const trimmedName = name.trim();
    const targetValue = Number(weeklyTargetValue);

    if (trimmedName.length === 0) {
      setError('Habit name is required.');
      return;
    }

    if (categoryId === null) {
      setError('Choose a category.');
      return;
    }

    if (!Number.isFinite(targetValue) || targetValue < 1) {
      setError('Weekly target must be at least 1.');
      return;
    }

    await db
      .update(habitsTable)
      .set({
        name: trimmedName,
        notes: notes.trim() || null,
        categoryId,
      })
      .where(eq(habitsTable.id, habit.id));

    if (weeklyTarget) {
      await db
        .update(targetsTable)
        .set({ targetValue })
        .where(eq(targetsTable.id, weeklyTarget.id));
    }

    await refreshData();
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Edit Habit" subtitle={`Update ${habit.name}`} />

        <View style={styles.form}>
          <FormField label="Habit name" value={name} onChangeText={setName} />
          <FormField label="Notes" value={notes} onChangeText={setNotes} />
          <FormField
            label="Weekly target"
            value={weeklyTargetValue}
            onChangeText={setWeeklyTargetValue}
          />

          <Text style={[styles.sectionLabel, { color: colors.mutedText }]}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => {
              const isSelected = categoryId === category.id;

              return (
                <Pressable
                  key={category.id}
                  accessibilityLabel={`Select ${category.name}`}
                  accessibilityRole="button"
                  onPress={() => setCategoryId(category.id)}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: colors.surfaceStrong,
                      borderColor: colors.border,
                    },
                    isSelected && {
                      backgroundColor: category.colour,
                      borderColor: category.colour,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      { color: colors.text },
                      isSelected && styles.categoryButtonTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <PrimaryButton label="Save Changes" onPress={saveChanges} />
        <View style={styles.buttonSpacing}>
          <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
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
  form: {
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryButton: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  categoryButtonText: {
    fontWeight: '600',
  },
  categoryButtonTextSelected: {
    color: Colors.light.surface,
  },
  errorText: {
    color: Colors.light.danger,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  buttonSpacing: {
    marginTop: Spacing.sm,
  },
});
