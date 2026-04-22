import PrimaryButton from '@/components/ui/primary-button';
import SectionCard from '@/components/ui/section-card';
import { Spacing } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { HabitLog } from '@/types/trackify';
import { formatDateLabel } from '@/utils/date';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  logs: HabitLog[];
  onEdit: (log: HabitLog) => void;
  onDelete: (logId: number) => Promise<void>;
};

export default function HabitLogList({ logs, onEdit, onDelete }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Activity logs</Text>
      {logs.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.mutedText }]}>
          No logs yet. Add one to start tracking progress.
        </Text>
      ) : (
        logs.map((log) => (
          <SectionCard key={log.id}>
            <View style={styles.row}>
              <View style={styles.logText}>
                <Text style={[styles.logDate, { color: colors.text }]}>
                  {formatDateLabel(log.date)}
                </Text>
                <Text style={[styles.logMeta, { color: colors.mutedText }]}>
                  Value {log.value}
                  {log.notes ? ` - ${log.notes}` : ''}
                </Text>
              </View>
              <View style={styles.actions}>
                <PrimaryButton
                  label="Edit"
                  compact
                  variant="secondary"
                  onPress={() => onEdit(log)}
                />
                <PrimaryButton
                  label="Delete"
                  compact
                  variant="danger"
                  onPress={() => onDelete(log.id)}
                />
              </View>
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
    fontSize: 18,
    fontWeight: '800',
    marginBottom: Spacing.md,
  },
  emptyText: {
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
    fontSize: 16,
    fontWeight: '800',
  },
  logMeta: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 2,
  },
  actions: {
    alignItems: 'flex-end',
  },
});
