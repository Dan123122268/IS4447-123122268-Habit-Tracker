import ChoiceChip from '@/components/ui/choice-chip';
import { Spacing } from '@/constants/theme';
import { DateRangeFilter as DateRangeFilterValue, dateRangeOptions } from '@/utils/filters';
import { StyleSheet, View } from 'react-native';

type Props = {
  value: DateRangeFilterValue;
  onChange: (value: DateRangeFilterValue) => void;
};

export default function DateRangeFilter({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {dateRangeOptions.map((option) => (
        <ChoiceChip
          key={option.value}
          label={option.label}
          selected={value === option.value}
          onPress={() => onChange(option.value)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    minHeight: 44,
    paddingTop: Spacing.md,
  },
});
