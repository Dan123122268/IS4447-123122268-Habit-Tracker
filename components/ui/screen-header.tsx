import { Spacing } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
};

export default function ScreenHeader({ title, subtitle }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={[styles.brandMark, { backgroundColor: colors.tint }]} />
        <Text style={[styles.brandText, { color: colors.tint }]}>TRACKIFY</Text>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: colors.mutedText }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  brandMark: {
    borderRadius: 3,
    height: 10,
    marginRight: Spacing.xs,
    width: 10,
  },
  brandText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
});

