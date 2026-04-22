import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Category, Habit, HabitLog, User } from '@/types/trackify';

function escapeCsv(value: string | number | boolean | null | undefined) {
  const text = String(value ?? '');

  if (!/[",\n]/.test(text)) return text;

  return `"${text.replace(/"/g, '""')}"`;
}

export function buildHabitLogsCsv(
  user: User,
  habits: Habit[],
  categories: Category[],
  logs: HabitLog[]
) {
  const header = [
    'profile',
    'habit',
    'category',
    'date',
    'value',
    'completed',
    'notes',
  ];
  const rows = logs.map((log) => {
    const habit = habits.find((item) => item.id === log.habitId);
    const category = categories.find((item) => item.id === habit?.categoryId);

    return [
      user.username,
      habit?.name ?? 'Unknown habit',
      category?.name ?? 'Unknown category',
      log.date,
      log.value,
      log.completed,
      log.notes,
    ];
  });

  return [header, ...rows]
    .map((row) => row.map((value) => escapeCsv(value)).join(','))
    .join('\n');
}

export async function exportHabitLogsCsv(
  user: User,
  habits: Habit[],
  categories: Category[],
  logs: HabitLog[]
) {
  if (!FileSystem.documentDirectory) {
    throw new Error('File export is not available on this device.');
  }

  const csv = buildHabitLogsCsv(user, habits, categories, logs);
  const fileUri = `${FileSystem.documentDirectory}trackify-${user.username}-habit-logs.csv`;

  await FileSystem.writeAsStringAsync(fileUri, csv);

  const canShare = await Sharing.isAvailableAsync();

  if (canShare) {
    await Sharing.shareAsync(fileUri, {
      dialogTitle: 'Export Trackify habit logs',
      mimeType: 'text/csv',
      UTI: 'public.comma-separated-values-text',
    });
  }

  return fileUri;
}
