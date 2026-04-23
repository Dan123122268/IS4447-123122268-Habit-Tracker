import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useTrackify } from '@/context/TrackifyContext';
import { db } from '@/db/client';
import { habits as habitsTable, targets as targetsTable } from '@/db/schema';
import { todayIso } from '@/utils/date';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddHabit() {
  const router = useRouter();
  const { activeUser, categories, colors, refreshData } = useTrackify();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [weeklyTarget, setWeeklyTarget] = useState('4');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryId === null && categories[0]) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const saveHabit = async () => {
    const trimmedName = name.trim();
    const targetValue = Number(weeklyTarget);

    if (!activeUser || categoryId === null) {
      setError('Create a category before adding a habit.');
      return;
    }

    if (trimmedName.length === 0) {
      setError('Habit name is required.');
      return;
    }

    if (!Number.isFinite(targetValue) || targetValue < 1) {
      setError('Weekly target must be at least 1.');
      return;
    }

    const insertedHabit = await db
      .insert(habitsTable)
      .values({
        userId: activeUser.id,
        categoryId,
        name: trimmedName,
        notes: notes.trim() || null,
        metricType: 'count',
        createdAt: todayIso(),
        isArchived: false,
      })
      .returning();

    await db.insert(targetsTable).values({
      userId: activeUser.id,
      habitId: insertedHabit[0].id,
      categoryId: null,
      period: 'weekly',
      targetValue,
      startsOn: todayIso(),
    });

    await refreshData();
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Add Habit" subtitle="Create a trackable routine." />

        <View style={styles.form}>
          <FormField
            label="Habit name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Morning run"
          />
          <FormField
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional details"
          />
          <FormField
            label="Weekly target"
            value={weeklyTarget}
            onChangeText={setWeeklyTarget}
            placeholder="4"
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

        <PrimaryButton label="Save Habit" onPress={saveHabit} />
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
    paddingBottom: Spacing.screenBottom,
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
