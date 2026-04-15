import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').notNull(),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  name: text('name').notNull(),
  colour: text('colour').notNull(),
  icon: text('icon').notNull(),
});

export const habits = sqliteTable('habits', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
  name: text('name').notNull(),
  notes: text('notes'),
  metricType: text('metric_type').notNull().default('count'),
  createdAt: text('created_at').notNull(),
  isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
});

export const habitLogs = sqliteTable('habit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  habitId: integer('habit_id')
    .notNull()
    .references(() => habits.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  date: text('date').notNull(),
  value: integer('value').notNull().default(1),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(true),
  notes: text('notes'),
});

export const targets = sqliteTable('targets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  habitId: integer('habit_id').references(() => habits.id),
  categoryId: integer('category_id').references(() => categories.id),
  period: text('period').notNull(),
  targetValue: integer('target_value').notNull(),
  startsOn: text('starts_on').notNull(),
});

export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  key: text('key').notNull(),
  value: text('value').notNull(),
});
