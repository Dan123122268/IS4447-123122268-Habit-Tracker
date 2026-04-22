import { Habit, HabitLog } from '@/types/trackify';

export type DateRangeFilter = 'all' | 'today' | 'week' | 'month';

export const dateRangeOptions: { label: string; value: DateRangeFilter }[] = [
  { label: 'All dates', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
];

function startOfWeekIso(date = new Date()) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy.toISOString().slice(0, 10);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function currentMonthKey() {
  return todayIso().slice(0, 7);
}

export function logMatchesDateRange(log: HabitLog, range: DateRangeFilter) {
  if (range === 'all') return true;
  if (range === 'today') return log.date === todayIso();
  if (range === 'week') return log.date >= startOfWeekIso() && log.date <= todayIso();
  return log.date.startsWith(currentMonthKey());
}

export function habitHasLogInDateRange(
  habit: Habit,
  logs: HabitLog[],
  range: DateRangeFilter
) {
  if (range === 'all') return true;

  return logs.some((log) => log.habitId === habit.id && logMatchesDateRange(log, range));
}
