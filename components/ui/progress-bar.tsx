import { Colors, Radius } from '@/constants/theme';
import { DimensionValue, StyleSheet, View } from 'react-native';

type Props = {
  progress: number;
  colour?: string;
};

export default function ProgressBar({ progress, colour = Colors.light.tint }: Props) {
  const width = `${Math.min(Math.max(progress, 0), 1) * 100}%` as DimensionValue;

  return (
    <View style={styles.track} accessibilityRole="progressbar">
      <View style={[styles.fill, { backgroundColor: colour, width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: '#E2E8F0',
    borderRadius: Radius.pill,
    height: 8,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: Radius.pill,
    height: '100%',
  },
});
