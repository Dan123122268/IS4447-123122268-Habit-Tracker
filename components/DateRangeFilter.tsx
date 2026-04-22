import ChoiceChip from '@/components/ui/choice-chip';
import { Spacing } from '@/constants/theme';
import { DateRangeFilter as DateRangeFilterValue, dateRangeOptions } from '@/utils/filters';
import { ScrollView, StyleSheet } from 'react-native';

type Props = {
  value: DateRangeFilterValue;
  onChange: (value: DateRangeFilterValue) => void;
};

export default function DateRangeFilter({ value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.row}
      showsHorizontalScrollIndicator={false}
    >
      {dateRangeOptions.map((option) => (
        <ChoiceChip
          key={option.value}
          label={option.label}
          selected={value === option.value}
          onPress={() => onChange(option.value)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.sm,
    paddingTop: Spacing.md,
  },
});
