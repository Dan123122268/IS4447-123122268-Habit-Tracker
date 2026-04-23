import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import SectionCard from '@/components/ui/section-card';
import { Colors, Palette, Radius, Spacing } from '@/constants/theme';
import { useTrackify } from '@/context/TrackifyContext';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { Ionicons } from '@expo/vector-icons';
import { eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const colourOptions = Object.values(Palette);
const iconOptions = [
  { name: 'Activity', value: 'fitness-outline' },
  { name: 'Book', value: 'book-outline' },
  { name: 'Heart', value: 'heart-outline' },
  { name: 'Moon', value: 'moon-outline' },
  { name: 'Target', value: 'radio-button-on-outline' },
] as const;

type CategoryIconValue = (typeof iconOptions)[number]['value'];

const isCategoryIconValue = (value: string): value is CategoryIconValue =>
  iconOptions.some((option) => option.value === value);

export default function CategoriesScreen() {
  const { activeUser, categories, colors, habits, refreshData } = useTrackify();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [colour, setColour] = useState(colourOptions[0].value);
  const [icon, setIcon] = useState<CategoryIconValue>(iconOptions[0].value);
  const [error, setError] = useState('');

  const editingCategory = categories.find((category) => category.id === editingId);

  useEffect(() => {
    if (!editingCategory) return;

    setName(editingCategory.name);
    setColour(editingCategory.colour);
    setIcon(isCategoryIconValue(editingCategory.icon) ? editingCategory.icon : iconOptions[0].value);
  }, [editingCategory]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setColour(colourOptions[0].value);
    setIcon(iconOptions[0].value);
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Categories"
          subtitle="Group habits by theme, colour, and icon."
        />

        <SectionCard>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
            {editingId === null ? 'New category' : `Editing ${editingCategory?.name}`}
          </Text>
          <FormField
            label="Category name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Fitness"
          />

          <Text style={[styles.sectionLabel, { color: colors.mutedText }]}>Colour</Text>
          <View style={styles.chipRow}>
            {colourOptions.map((option) => (
              <Pressable
                key={option.value}
                accessibilityLabel={`Select ${option.name}`}
                accessibilityRole="button"
                onPress={() => setColour(option.value)}
                style={[
                  styles.colourOption,
                  {
                    backgroundColor: colors.surfaceStrong,
                    borderColor: colors.border,
                  },
                  colour === option.value && {
                    backgroundColor: option.value,
                    borderColor: option.value,
                  },
                ]}
              >
                <View
                  style={[
                    styles.colourDot,
                    {
                      backgroundColor: colour === option.value ? '#FFFFFF' : option.value,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.colourLabel,
                    { color: colour === option.value ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {option.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.mutedText }]}>Icon</Text>
          <View style={styles.chipRow}>
            {iconOptions.map((option) => (
              <Pressable
                key={option.value}
                accessibilityLabel={`Select ${option.name} icon`}
                accessibilityRole="button"
                onPress={() => setIcon(option.value)}
                style={[
                  styles.iconOption,
                  {
                    backgroundColor: colors.surfaceStrong,
                    borderColor: colors.border,
                  },
                  icon === option.value && {
                    backgroundColor: colour,
                    borderColor: colour,
                  },
                ]}
              >
                <Ionicons
                  name={option.value}
                  size={18}
                  color={icon === option.value ? '#FFFFFF' : colour}
                />
                <Text
                  style={[
                    styles.colourLabel,
                    { color: icon === option.value ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {option.name}
                </Text>
              </Pressable>
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

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Existing categories</Text>
        {categories.map((category) => {
          const habitCount = habits.filter((habit) => habit.categoryId === category.id).length;

          return (
            <SectionCard key={category.id}>
              <View style={styles.row}>
                <View style={styles.categoryHeading}>
                  <View style={[styles.swatch, { backgroundColor: category.colour }]}>
                    <Ionicons
                      name={
                        (isCategoryIconValue(category.icon)
                          ? category.icon
                          : iconOptions[0].value) as keyof typeof Ionicons.glyphMap
                      }
                      size={18}
                      color="#FFFFFF"
                    />
                  </View>
                  <View>
                    <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                    <Text style={[styles.categoryMeta, { color: colors.mutedText }]}>
                      {iconOptions.find((option) => option.value === category.icon)?.name ?? 'Custom'} - {habitCount} habits
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
  colourOption: {
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: Radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  colourDot: {
    borderRadius: Radius.pill,
    height: 12,
    marginRight: Spacing.sm,
    width: 12,
  },
  colourLabel: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: '700',
  },
  iconOption: {
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: Radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
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
    alignItems: 'center',
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
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
