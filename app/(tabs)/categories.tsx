import ChoiceChip from '@/components/ui/choice-chip';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import SectionCard from '@/components/ui/section-card';
import { Colors, Spacing } from '@/constants/theme';
import { useTrackify } from '@/context/TrackifyContext';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const colourOptions = ['#0F766E', '#2563EB', '#C2410C', '#9333EA', '#BE123C'];
const iconOptions = ['activity', 'book', 'heart', 'moon', 'target'];

export default function CategoriesScreen() {
  const { activeUser, categories, habits, refreshData } = useTrackify();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [colour, setColour] = useState(colourOptions[0]);
  const [icon, setIcon] = useState(iconOptions[0]);
  const [error, setError] = useState('');

  const editingCategory = categories.find((category) => category.id === editingId);

  useEffect(() => {
    if (!editingCategory) return;

    setName(editingCategory.name);
    setColour(editingCategory.colour);
    setIcon(editingCategory.icon);
  }, [editingCategory]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setColour(colourOptions[0]);
    setIcon(iconOptions[0]);
    setError('');
  };

  const saveCategory = async () => {
    const trimmedName = name.trim();

    if (!activeUser) {
      setError('A local profile is needed before saving categories.');
      return;
    }

    if (trimmedName.length === 0) {
      setError('Category name is required.');
      return;
    }

    if (editingId === null) {
      await db.insert(categoriesTable).values({
        userId: activeUser.id,
        name: trimmedName,
        colour,
        icon,
      });
    } else {
      await db
        .update(categoriesTable)
        .set({ name: trimmedName, colour, icon })
        .where(eq(categoriesTable.id, editingId));
    }

    await refreshData();
    resetForm();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Categories"
          subtitle="Group habits by theme, colour, and icon."
        />

        <SectionCard>
          <Text style={styles.cardTitle}>
            {editingId === null ? 'New category' : `Editing ${editingCategory?.name}`}
          </Text>
          <FormField
            label="Category name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Fitness"
          />

          <Text style={styles.sectionLabel}>Colour</Text>
          <View style={styles.chipRow}>
            {colourOptions.map((option) => (
              <ChoiceChip
                key={option}
                label={option}
                selected={colour === option}
                onPress={() => setColour(option)}
                colour={option}
              />
            ))}
          </View>

          <Text style={styles.sectionLabel}>Icon</Text>
          <View style={styles.chipRow}>
            {iconOptions.map((option) => (
              <ChoiceChip
                key={option}
                label={option}
                selected={icon === option}
                onPress={() => setIcon(option)}
                colour={colour}
              />
            ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <PrimaryButton
            label={editingId === null ? 'Create Category' : 'Save Category'}
            onPress={saveCategory}
          />
          {editingId !== null ? (
            <View style={styles.buttonSpacing}>
              <PrimaryButton label="Cancel Edit" variant="secondary" onPress={resetForm} />
            </View>
          ) : null}
        </SectionCard>

        <Text style={styles.sectionTitle}>Existing categories</Text>
        {categories.map((category) => {
          const habitCount = habits.filter((habit) => habit.categoryId === category.id).length;

          return (
            <SectionCard key={category.id}>
              <View style={styles.row}>
                <View style={styles.categoryHeading}>
                  <View style={[styles.swatch, { backgroundColor: category.colour }]} />
                  <View>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryMeta}>
                      {category.icon} • {habitCount} habits
                    </Text>
                  </View>
                </View>
                <PrimaryButton
                  label="Edit"
                  compact
                  variant="secondary"
                  onPress={() => setEditingId(category.id)}
                />
              </View>
            </SectionCard>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.light.background,
    flex: 1,
    padding: Spacing.xl,
  },
  content: {
    paddingBottom: Spacing.xxl,
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
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryHeading: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  swatch: {
    borderRadius: 8,
    height: 36,
    marginRight: Spacing.md,
    width: 36,
  },
  categoryName: {
    color: Colors.light.text,
    fontSize: 17,
    fontWeight: '800',
  },
  categoryMeta: {
    color: Colors.light.mutedText,
    fontSize: 13,
    marginTop: 2,
  },
});
