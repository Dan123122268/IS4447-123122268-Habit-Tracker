import { buildHabitLogsCsv } from '../utils/export';
import { Category, Habit, HabitLog, User } from '../types/trackify';

const user: User = {
  id: 1,
  username: 'demo',
  passwordHash: 'hash',
  createdAt: '2026-04-01',
};

const categories: Category[] = [
  { id: 1, userId: 1, name: 'Fitness', colour: '#0F766E', icon: 'activity' },
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
];

const logs: HabitLog[] = [
  {
    id: 1,
    habitId: 1,
    userId: 1,
    date: '2026-04-02',
    value: 1,
    completed: true,
    notes: 'Easy, steady run',
  },
];

describe('CSV export helpers', () => {
  it('builds habit log CSV with escaped values', () => {
    const csv = buildHabitLogsCsv(user, habits, categories, logs);

    expect(csv).toContain('profile,habit,category,date,value,completed,notes');
    expect(csv).toContain('demo,Morning Run,Fitness,2026-04-02,1,true,"Easy, steady run"');
  });
});
