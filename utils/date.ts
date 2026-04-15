import { HabitLog } from '@/types/trackify';

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function startOfWeekIso(date = new Date()) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy.toISOString().slice(0, 10);
}

export function isCurrentWeek(dateIso: string) {
  return dateIso >= startOfWeekIso() && dateIso <= todayIso();
}

export function totalForCurrentWeek(habitId: number, logs: HabitLog[]) {
  return logs
    .filter((log) => log.habitId === habitId && isCurrentWeek(log.date))
    .reduce((total, log) => total + log.value, 0);
}

export function formatDateLabel(dateIso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${dateIso}T00:00:00`));
}
