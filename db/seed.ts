import { db } from './client';
import {
  categories,
  habitLogs,
  habits,
  settings,
  targets,
  users,
} from './schema';

const seedUser = {
  id: 1,
  username: 'demo',
  passwordHash: 'local-demo-password',
  createdAt: '2026-04-08',
};

const seedCategories = [
  { id: 1, userId: 1, name: 'Fitness', colour: '#0F766E', icon: 'activity' },
  { id: 2, userId: 1, name: 'Learning', colour: '#2563EB', icon: 'book-open' },
  { id: 3, userId: 1, name: 'Wellbeing', colour: '#C2410C', icon: 'heart' },
];

const seedHabits = [
  {
    id: 1,
    userId: 1,
    categoryId: 1,
    name: 'Morning Run',
    notes: 'Track every run, even short ones.',
    metricType: 'count',
    createdAt: '2026-04-08',
    isArchived: false,
  },
  {
    id: 2,
    userId: 1,
    categoryId: 2,
    name: 'Read 20 Pages',
    notes: 'Books, articles, or course material.',
    metricType: 'count',
    createdAt: '2026-04-08',
    isArchived: false,
  },
  {
    id: 3,
    userId: 1,
    categoryId: 3,
    name: 'Evening Reflection',
    notes: 'Quick journal entry before bed.',
    metricType: 'completion',
    createdAt: '2026-04-08',
    isArchived: false,
  },
];

const seedHabitLogs = [
  { id: 1, habitId: 1, userId: 1, date: '2026-04-01', value: 1, completed: true, notes: 'Easy 3k.' },
  { id: 2, habitId: 1, userId: 1, date: '2026-04-02', value: 1, completed: true, notes: 'Felt stronger.' },
  { id: 3, habitId: 2, userId: 1, date: '2026-04-02', value: 20, completed: true, notes: 'Finished a chapter.' },
  { id: 4, habitId: 3, userId: 1, date: '2026-04-02', value: 1, completed: true, notes: 'Short entry.' },
  { id: 5, habitId: 2, userId: 1, date: '2026-04-03', value: 25, completed: true, notes: 'Extra reading.' },
  { id: 6, habitId: 3, userId: 1, date: '2026-04-03', value: 1, completed: true, notes: 'Good day.' },
];

const seedTargets = [
  { id: 1, userId: 1, habitId: 1, categoryId: null, period: 'weekly', targetValue: 4, startsOn: '2026-04-01' },
  { id: 2, userId: 1, habitId: 2, categoryId: null, period: 'weekly', targetValue: 100, startsOn: '2026-04-01' },
  { id: 3, userId: 1, habitId: null, categoryId: 3, period: 'monthly', targetValue: 20, startsOn: '2026-04-01' },
];

const seedSettings = [
  { id: 1, userId: 1, key: 'theme', value: 'system' },
];

export async function seedTrackifyIfEmpty() {
  const existingHabits = await db.select().from(habits);

  if (existingHabits.length > 0) {
    return;
  }

  await db.insert(users).values(seedUser);
  await db.insert(categories).values(seedCategories);
  await db.insert(habits).values(seedHabits);
  await db.insert(habitLogs).values(seedHabitLogs);
  await db.insert(targets).values(seedTargets);
  await db.insert(settings).values(seedSettings);
}
