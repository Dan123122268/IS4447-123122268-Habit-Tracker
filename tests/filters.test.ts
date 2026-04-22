import { habitHasLogInDateRange, logMatchesDateRange } from '../utils/filters';
import { Habit, HabitLog } from '../types/trackify';

const habit: Habit = {
  id: 1,
  userId: 1,
  categoryId: 1,
  name: 'Morning Run',
  notes: null,
  metricType: 'count',
  createdAt: '2026-04-01',
  isArchived: false,
};

describe('filter helpers', () => {
  it('matches all logs for the all date range', () => {
    const log: HabitLog = {
      id: 1,
      habitId: 1,
      userId: 1,
      date: '2026-01-01',
      value: 1,
      completed: true,
      notes: null,
    };

    expect(logMatchesDateRange(log, 'all')).toBe(true);
  });

  it('requires a matching log when filtering habits by date range', () => {
    const logs: HabitLog[] = [
      {
        id: 1,
        habitId: 2,
        userId: 1,
        date: '2026-04-01',
        value: 1,
        completed: true,
        notes: null,
      },
    ];

    expect(habitHasLogInDateRange(habit, logs, 'today')).toBe(false);
    expect(habitHasLogInDateRange(habit, logs, 'all')).toBe(true);
  });
});
