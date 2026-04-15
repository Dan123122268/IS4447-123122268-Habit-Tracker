export type User = {
  id: number;
  username: string;
  passwordHash: string;
  createdAt: string;
};

export type Category = {
  id: number;
  userId: number;
  name: string;
  colour: string;
  icon: string;
};

export type Habit = {
  id: number;
  userId: number;
  categoryId: number;
  name: string;
  notes: string | null;
  metricType: string;
  createdAt: string;
  isArchived: boolean;
};

export type HabitLog = {
  id: number;
  habitId: number;
  userId: number;
  date: string;
  value: number;
  completed: boolean;
  notes: string | null;
};

export type Target = {
  id: number;
  userId: number;
  habitId: number | null;
  categoryId: number | null;
  period: string;
  targetValue: number;
  startsOn: string;
};

export type Setting = {
  id: number;
  userId: number;
  key: string;
  value: string;
};
