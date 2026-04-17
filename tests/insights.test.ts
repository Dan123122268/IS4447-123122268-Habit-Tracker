import {
  buildDailyChart,
  calculateHabitStreak,
  topHabitByVolume,
} from '../utils/insights';
import { Habit, HabitLog } from '../types/trackify';

const logs: HabitLog[] = [
  { id: 1, habitId: 1, userId: 1, date: '2026-04-01', value: 1, completed: true, notes: null },
  { id: 2, habitId: 1, userId: 1, date: '2026-04-02', value: 1, completed: true, notes: null },
  { id: 3, habitId: 1, userId: 1, date: '2026-04-03', value: 1, completed: true, notes: null },
  { id: 4, habitId: 2, userId: 1, date: '2026-04-03', value: 5, completed: true, notes: null },
];

const habits: Habit[] = [
  {
    id: 1,
    userId: 1,
    categoryId: 1,
    name: 'Morning Run',
    notes: null,
    metricType: 'count',
    createdAt: '2026-04-01',
    isArchived: false,
  },
  {
    id: 2,
    userId: 1,
    categoryId: 1,
    name: 'Read',
    notes: null,
    metricType: 'count',
    createdAt: '2026-04-01',
    isArchived: false,
  },
];

describe('insight helpers', () => {
  it('calculates consecutive habit streaks', () => {
    expect(calculateHabitStreak(1, logs)).toBe(3);
    expect(calculateHabitStreak(2, logs)).toBe(1);
  });

  it('builds daily chart points from log values', () => {
    const chart = buildDailyChart(logs, 3);

    expect(chart.map((point) => point.value)).toEqual([1, 1, 6]);
  });

  it('finds the top habit by total logged volume', () => {
    expect(topHabitByVolume(habits, logs)?.habit.name).toBe('Read');
  });
});
