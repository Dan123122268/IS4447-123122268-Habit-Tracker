import { Colors, Spacing } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
};

export default function ScreenHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.light.text,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.light.mutedText,
    fontSize: 14,
    marginTop: 4,
  },
});
