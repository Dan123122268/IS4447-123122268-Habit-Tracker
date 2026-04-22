import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import SectionCard from '@/components/ui/section-card';
import { Colors, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { HabitLog } from '@/types/trackify';
import { todayIso } from '@/utils/date';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type HabitLogInput = {
  date: string;
  value: number;
  notes: string | null;
};

type Props = {
  onSave: (input: HabitLogInput) => Promise<void>;
  initialLog?: HabitLog | null;
  onCancel?: () => void;
};

export default function HabitLogForm({ onSave, initialLog, onCancel }: Props) {
  const colors = useThemeColors();
  const isEditing = Boolean(initialLog);
  const [date, setDate] = useState(initialLog?.date ?? todayIso());
  const [value, setValue] = useState('1');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setDate(initialLog?.date ?? todayIso());
    setValue(String(initialLog?.value ?? 1));
    setNotes(initialLog?.notes ?? '');
    setError('');
  }, [initialLog]);

  const submit = async () => {
    const numericValue = Number(value);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError('Date must use YYYY-MM-DD format.');
      return;
    }

    if (!Number.isFinite(numericValue) || numericValue < 1) {
      setError('Value must be at least 1.');
      return;
    }

    await onSave({
      date,
      value: numericValue,
      notes: notes.trim() || null,
    });

    if (!isEditing) {
      setValue('1');
      setNotes('');
    }

    setError('');
  };

  return (
    <SectionCard>
      <Text style={[styles.title, { color: colors.text }]}>
        {isEditing ? 'Edit log' : 'Add log'}
      </Text>
      <FormField label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
      <FormField label="Value" value={value} onChangeText={setValue} placeholder="1" />
      <FormField label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional" />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <PrimaryButton label={isEditing ? 'Save Log Changes' : 'Save Log'} onPress={submit} />
      {isEditing && onCancel ? (
        <View style={styles.buttonSpacing}>
          <PrimaryButton label="Cancel Edit" variant="secondary" onPress={onCancel} />
        </View>
      ) : null}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Colors.light.danger,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  buttonSpacing: {
    marginTop: Spacing.sm,
  },
});
