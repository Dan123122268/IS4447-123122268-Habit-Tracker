import { Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  colour?: string;
};

export default function ChoiceChip({ label, selected, onPress, colour }: Props) {
  const colors = useThemeColors();
  const selectedColour = colour ?? colors.tint;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        selected && {
          backgroundColor: selectedColour,
          borderColor: selectedColour,
        },
      ]}
    >
      <Text style={[styles.label, { color: selected ? '#FFFFFF' : colors.text }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});

