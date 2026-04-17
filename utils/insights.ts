import { Habit, HabitLog } from '@/types/trackify';

export type ChartPoint = {
  label: string;
  value: number;
};

function toDate(dateIso: string) {
  return new Date(`${dateIso}T12:00:00`);
}

function toIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function startOfWeek(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy;
}

function latestLogDate(logs: HabitLog[]) {
  const latest = logs
    .map((log) => log.date)
    .sort((a, b) => b.localeCompare(a))[0];

  return latest ? toDate(latest) : new Date();
}

export function totalLogged(logs: HabitLog[]) {
  return logs.reduce((total, log) => total + log.value, 0);
}

export function completedLogCount(logs: HabitLog[]) {
  return logs.filter((log) => log.completed || log.value > 0).length;
}

export function buildDailyChart(logs: HabitLog[], days = 7): ChartPoint[] {
  const end = latestLogDate(logs);

  return Array.from({ length: days }, (_, index) => {
    const date = addDays(end, index - (days - 1));
    const dateIso = toIso(date);
    const label = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
    }).format(date);
    const value = logs
      .filter((log) => log.date === dateIso)
      .reduce((total, log) => total + log.value, 0);

    return { label, value };
  });
}

export function buildWeeklyChart(logs: HabitLog[], weeks = 6): ChartPoint[] {
  const end = startOfWeek(latestLogDate(logs));

  return Array.from({ length: weeks }, (_, index) => {
    const weekStart = addDays(end, (index - (weeks - 1)) * 7);
    const weekEnd = addDays(weekStart, 6);
    const label = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
    }).format(weekStart);
    const value = logs
      .filter((log) => {
        const date = toDate(log.date);
        return date >= weekStart && date <= weekEnd;
      })
      .reduce((total, log) => total + log.value, 0);

    return { label, value };
  });
}

export function buildMonthlyChart(logs: HabitLog[], months = 6): ChartPoint[] {
  const latest = latestLogDate(logs);
  const end = new Date(latest.getFullYear(), latest.getMonth(), 1);

  return Array.from({ length: months }, (_, index) => {
    const month = new Date(end.getFullYear(), end.getMonth() + index - (months - 1), 1);
    const key = month.toISOString().slice(0, 7);
    const label = new Intl.DateTimeFormat('en-GB', {
      month: 'short',
    }).format(month);
    const value = logs
      .filter((log) => log.date.startsWith(key))
      .reduce((total, log) => total + log.value, 0);

    return { label, value };
  });
}

export function calculateHabitStreak(habitId: number, logs: HabitLog[]) {
  const completedDates = Array.from(
    new Set(
      logs
        .filter((log) => log.habitId === habitId && (log.completed || log.value > 0))
        .map((log) => log.date)
    )
  ).sort((a, b) => b.localeCompare(a));

  if (completedDates.length === 0) return 0;

  let streak = 1;
  let expectedPrevious = addDays(toDate(completedDates[0]), -1);

  for (const dateIso of completedDates.slice(1)) {
    if (dateIso !== toIso(expectedPrevious)) break;

    streak += 1;
    expectedPrevious = addDays(expectedPrevious, -1);
  }

  return streak;
}

export function topHabitByVolume(habits: Habit[], logs: HabitLog[]) {
  return habits
    .map((habit) => ({
      habit,
      total: logs
        .filter((log) => log.habitId === habit.id)
        .reduce((sum, log) => sum + log.value, 0),
    }))
    .sort((a, b) => b.total - a.total)[0];
}
