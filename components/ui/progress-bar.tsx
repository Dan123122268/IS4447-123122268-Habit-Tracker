import { Colors, Radius } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { DimensionValue, StyleSheet, View } from 'react-native';

type Props = {
  progress: number;
  colour?: string;
};

export default function ProgressBar({ progress, colour = Colors.light.tint }: Props) {
  const colors = useThemeColors();
  const width = `${Math.min(Math.max(progress, 0), 1) * 100}%` as DimensionValue;

  return (
    <View
      style={[styles.track, { backgroundColor: colors.surfaceStrong }]}
      accessibilityRole="progressbar"
    >
      <View style={[styles.fill, { backgroundColor: colour, width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: Radius.pill,
    height: 8,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: Radius.pill,
    height: '100%',
  },
});

