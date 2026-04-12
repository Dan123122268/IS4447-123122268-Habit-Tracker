import { Colors, Radius, Spacing } from '@/constants/theme';
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
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' ? styles.secondary : null,
        variant === 'danger' ? styles.danger : null,
        compact ? styles.compact : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'secondary' ? styles.secondaryLabel : null,
          variant === 'danger' ? styles.dangerLabel : null,
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
    backgroundColor: Colors.light.tint,
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  secondary: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.border,
    borderWidth: 1,
  },
  danger: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
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
  secondaryLabel: {
    color: Colors.light.text,
  },
  dangerLabel: {
    color: '#7F1D1D',
  },
  compactLabel: {
    fontSize: 13,
  },
});
