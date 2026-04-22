import { Colors, Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { ChartPoint } from '@/utils/insights';
import { DimensionValue, StyleSheet, Text, View } from 'react-native';

type Props = {
  data: ChartPoint[];
};

export default function SimpleBarChart({ data }: Props) {
  const colors = useThemeColors();
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <View style={styles.chart} accessibilityLabel="Habit activity bar chart">
      {data.map((item) => {
        const height = `${Math.max(
          (item.value / maxValue) * 100,
          item.value > 0 ? 10 : 4
        )}%` as DimensionValue;

        return (
          <View key={item.label} style={styles.barGroup}>
            <View style={[styles.barTrack, { backgroundColor: colors.surfaceStrong }]}>
              <View style={[styles.bar, { backgroundColor: colors.tint, height }]} />
            </View>
            <Text style={[styles.value, { color: colors.text }]}>{item.value}</Text>
            <Text style={[styles.label, { color: colors.mutedText }]} numberOfLines={1}>
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: 190,
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  barTrack: {
    alignItems: 'center',
    borderRadius: Radius.pill,
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    width: 18,
  },
  bar: {
    borderRadius: Radius.pill,
    width: '100%',
  },
  value: {
    color: Colors.light.text,
    fontSize: 11,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    maxWidth: 46,
  },
});

