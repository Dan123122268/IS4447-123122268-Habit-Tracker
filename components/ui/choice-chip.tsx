import { Colors, Radius, Spacing } from '@/constants/theme';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  colour?: string;
};

export default function ChoiceChip({ label, selected, onPress, colour }: Props) {
  const selectedColour = colour ?? Colors.light.text;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.chip,
        selected && {
          backgroundColor: selectedColour,
          borderColor: selectedColour,
        },
      ]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  label: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedLabel: {
    color: Colors.light.surface,
  },
});
