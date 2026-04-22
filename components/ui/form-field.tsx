import { Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
};

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
}: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.mutedText }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholder={placeholder ?? label}
        placeholderTextColor={colors.mutedText}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
});

