import ChoiceChip from '@/components/ui/choice-chip';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ProgressBar from '@/components/ui/progress-bar';
import ScreenHeader from '@/components/ui/screen-header';
import SectionCard from '@/components/ui/section-card';
import { Colors, Spacing } from '@/constants/theme';
import { useTrackify } from '@/context/TrackifyContext';
import { db } from '@/db/client';
import { targets as targetsTable } from '@/db/schema';
import { Target } from '@/types/trackify';
import { todayIso, totalForPeriod } from '@/utils/date';
import { eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Scope = 'habit' | 'category';
type Period = 'weekly' | 'monthly';

export default function TargetsScreen() {
  const { activeUser, categories, colors, habits, logs, targets, refreshData } = useTrackify();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [scope, setScope] = useState<Scope>('habit');
  const [period, setPeriod] = useState<Period>('weekly');
  const [selectedId, setSelectedId] = useState<number | null>(habits[0]?.id ?? null);
  const [targetValue, setTargetValue] = useState('4');
  const [error, setError] = useState('');

  const editingTarget = targets.find((target) => target.id === editingId);
  const scopeOptions = scope === 'habit' ? habits : categories;

  useEffect(() => {
    if (!editingTarget) return;

    if (editingTarget.habitId !== null) {
      setScope('habit');
      setSelectedId(editingTarget.habitId);
    } else if (editingTarget.categoryId !== null) {
      setScope('category');
      setSelectedId(editingTarget.categoryId);
    }

    setPeriod(editingTarget.period === 'monthly' ? 'monthly' : 'weekly');
    setTargetValue(String(editingTarget.targetValue));
  }, [editingTarget]);

  useEffect(() => {
    if (editingId !== null) return;

    const fallbackId = scope === 'habit' ? habits[0]?.id : categories[0]?.id;
    setSelectedId(fallbackId ?? null);
  }, [categories, editingId, habits, scope]);

  const resetForm = () => {
    setEditingId(null);
    setScope('habit');
    setPeriod('weekly');
    setSelectedId(habits[0]?.id ?? null);
    setTargetValue('4');
    setError('');
  };

  const saveTarget = async () => {
    const numericTarget = Number(targetValue);

    if (!activeUser) {
      setError('A local profile is needed before saving targets.');
      return;
    }

    if (selectedId === null) {
      setError(`Choose a ${scope}.`);
      return;
    }

    if (!Number.isFinite(numericTarget) || numericTarget < 1) {
      setError('Target value must be at least 1.');
      return;
    }

    const payload = {
      userId: activeUser.id,
      habitId: scope === 'habit' ? selectedId : null,
      categoryId: scope === 'category' ? selectedId : null,
      period,
      targetValue: numericTarget,
      startsOn: todayIso(),
    };

    if (editingId === null) {
      await db.insert(targetsTable).values(payload);
    } else {
      await db
        .update(targetsTable)
        .set(payload)
        .where(eq(targetsTable.id, editingId));
    }

    await refreshData();
    resetForm();
  };

  const getTargetLabel = (target: Target) => {
    if (target.habitId !== null) {
      return habits.find((habit) => habit.id === target.habitId)?.name ?? 'Habit target';
    }

    return categories.find((category) => category.id === target.categoryId)?.name ?? 'Category target';
  };

  const getTargetHabitIds = (target: Target) => {
    if (target.habitId !== null) return [target.habitId];
    if (target.categoryId === null) return [];

    return habits
      .filter((habit) => habit.categoryId === target.categoryId && !habit.isArchived)
      .map((habit) => habit.id);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Targets"
          subtitle="Define weekly or monthly goals and monitor progress."
        />

        <SectionCard>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {editingId === null ? 'New target' : `Editing ${getTargetLabel(editingTarget!)}`}
          </Text>

          <Text style={[styles.sectionLabel, { color: colors.mutedText }]}>Scope</Text>
          <View style={styles.chipRow}>
            <ChoiceChip
              label="Habit"
              selected={scope === 'habit'}
              onPress={() => setScope('habit')}
            />
            <ChoiceChip
              label="Category"
              selected={scope === 'category'}
              onPress={() => setScope('category')}
            />
          </View>

          <Text style={[styles.sectionLabel, { color: colors.mutedText }]}>
            {scope === 'habit' ? 'Habit' : 'Category'}
          </Text>
          <View style={styles.chipRow}>
            {scopeOptions.map((option) => (
              <ChoiceChip
                key={option.id}
                label={option.name}
                selected={selectedId === option.id}
                onPress={() => setSelectedId(option.id)}
                colour={'colour' in option ? option.colour : undefined}
              />
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.mutedText }]}>Period</Text>
          <View style={styles.chipRow}>
            <ChoiceChip
              label="Weekly"
              selected={period === 'weekly'}
              onPress={() => setPeriod('weekly')}
            />
            <ChoiceChip
              label="Monthly"
              selected={period === 'monthly'}
              onPress={() => setPeriod('monthly')}
            />
          </View>

          <FormField
            label="Target amount"
            value={targetValue}
            onChangeText={setTargetValue}
            placeholder="4"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <PrimaryButton
            label={editingId === null ? 'Create Target' : 'Save Target'}
            onPress={saveTarget}
          />
          {editingId !== null ? (
            <View style={styles.buttonSpacing}>
              <PrimaryButton label="Cancel Edit" variant="secondary" onPress={resetForm} />
            </View>
          ) : null}
        </SectionCard>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Active targets</Text>
        {targets.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.mutedText }]}>No targets yet.</Text>
        ) : (
          targets.map((target) => {
            const total = totalForPeriod(getTargetHabitIds(target), logs, target.period);
            const progress = total / target.targetValue;
            const remaining = Math.max(target.targetValue - total, 0);

            return (
              <SectionCard key={target.id}>
                <View style={styles.targetHeader}>
                  <View style={styles.targetText}>
                    <Text style={[styles.targetName, { color: colors.text }]}>
                      {getTargetLabel(target)}
                    </Text>
                    <Text style={[styles.targetMeta, { color: colors.mutedText }]}>
                      {target.period} - {total}/{target.targetValue}
                    </Text>
                  </View>
                  <PrimaryButton
                    label="Edit"
                    compact
                    variant="secondary"
                    onPress={() => setEditingId(target.id)}
                  />
                </View>
                <ProgressBar progress={progress} />
                <Text style={[styles.targetHint, { color: colors.mutedText }]}>
                  {remaining === 0 ? 'Target reached or exceeded' : `${remaining} remaining`}
                </Text>
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
  cardTitle: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionLabel: {
    color: Colors.light.mutedText,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Colors.light.danger,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  buttonSpacing: {
    marginTop: Spacing.sm,
  },
  emptyText: {
    color: Colors.light.mutedText,
  },
  targetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  targetText: {
    flex: 1,
    marginRight: Spacing.md,
  },
  targetName: {
    color: Colors.light.text,
    fontSize: 17,
    fontWeight: '800',
  },
  targetMeta: {
    color: Colors.light.mutedText,
    fontSize: 13,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  targetHint: {
    color: Colors.light.mutedText,
    fontSize: 13,
    marginTop: Spacing.sm,
  },
});

