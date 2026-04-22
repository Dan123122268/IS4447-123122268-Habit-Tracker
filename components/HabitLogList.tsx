import PrimaryButton from '@/components/ui/primary-button';
import SectionCard from '@/components/ui/section-card';
import { Colors, Spacing } from '@/constants/theme';
import { HabitLog } from '@/types/trackify';
import { formatDateLabel } from '@/utils/date';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  logs: HabitLog[];
  onDelete: (logId: number) => Promise<void>;
};

export default function HabitLogList({ logs, onDelete }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Activity logs</Text>
      {logs.length === 0 ? (
        <Text style={styles.emptyText}>No logs yet. Add one to start tracking progress.</Text>
      ) : (
        logs.map((log) => (
          <SectionCard key={log.id}>
            <View style={styles.row}>
              <View style={styles.logText}>
                <Text style={styles.logDate}>{formatDateLabel(log.date)}</Text>
                <Text style={styles.logMeta}>
                  Value {log.value}
                  {log.notes ? ` - ${log.notes}` : ''}
                </Text>
              </View>
              <PrimaryButton
                label="Delete"
                compact
                variant="danger"
                onPress={() => onDelete(log.id)}
              />
            </View>
          </SectionCard>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: Spacing.xxl,
  },
  sectionTitle: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: Spacing.md,
  },
  emptyText: {
    color: Colors.light.mutedText,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logText: {
    flex: 1,
    marginRight: Spacing.md,
  },
  logDate: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '800',
  },
  logMeta: {
    color: Colors.light.mutedText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 2,
  },
});
