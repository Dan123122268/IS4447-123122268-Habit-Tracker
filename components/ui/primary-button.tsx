import { Colors, Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  compact?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
};

export default function PrimaryButton({
  label,
  onPress,
  compact = false,
  variant = 'primary',
}: Props) {
  const colors = useThemeColors();
  const dangerBackground = colors.background === Colors.dark.background ? '#451A1A' : '#FEF2F2';
  const dangerText = colors.background === Colors.dark.background ? '#FECACA' : '#7F1D1D';

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.tint,
        },
        variant === 'secondary'
          ? {
              backgroundColor: colors.surfaceStrong,
              borderColor: colors.border,
              borderWidth: 1,
            }
          : null,
        variant === 'danger'
          ? {
              backgroundColor: dangerBackground,
              borderColor: Colors.light.danger,
              borderWidth: 1,
            }
          : null,
        compact ? styles.compact : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'secondary' ? { color: colors.text } : null,
          variant === 'danger' ? { color: dangerText } : null,
          compact ? styles.compactLabel : null,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  compact: {
    alignSelf: 'flex-start',
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  compactLabel: {
    fontSize: 13,
  },
});

