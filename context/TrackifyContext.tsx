import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { db } from '@/db/client';
import {
  categories as categoriesTable,
  habitLogs as habitLogsTable,
  habits as habitsTable,
  settings as settingsTable,
  targets as targetsTable,
  users as usersTable,
} from '@/db/schema';
import { seedTrackifyIfEmpty } from '@/db/seed';
import { Category, Habit, HabitLog, Setting, Target, User } from '@/types/trackify';

type TrackifyContextType = {
  categories: Category[];
  habits: Habit[];
  logs: HabitLog[];
  targets: Target[];
  settings: Setting[];
  activeUser: User | null;
  isLoading: boolean;
  refreshData: () => Promise<void>;
};

const TrackifyContext = createContext<TrackifyContextType | null>(null);

type Props = {
  children: ReactNode;
};

export function TrackifyProvider({ children }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    const [userRows, categoryRows, habitRows, logRows, targetRows, settingRows] =
      await Promise.all([
        db.select().from(usersTable),
        db.select().from(categoriesTable),
        db.select().from(habitsTable),
        db.select().from(habitLogsTable),
        db.select().from(targetsTable),
        db.select().from(settingsTable),
      ]);

    setActiveUser(userRows[0] ?? null);
    setCategories(categoryRows);
    setHabits(habitRows);
    setLogs(logRows);
    setTargets(targetRows);
    setSettings(settingRows);
  }, []);

  useEffect(() => {
    const loadTrackify = async () => {
      setIsLoading(true);
      await seedTrackifyIfEmpty();
      await refreshData();
      setIsLoading(false);
    };

    void loadTrackify();
  }, [refreshData]);

  return (
    <TrackifyContext.Provider
      value={{
        categories,
        habits,
        logs,
        targets,
        settings,
        activeUser,
        isLoading,
        refreshData,
      }}
    >
      {children}
    </TrackifyContext.Provider>
  );
}

export function useTrackify() {
  const context = useContext(TrackifyContext);

  if (!context) {
    throw new Error('useTrackify must be used inside TrackifyProvider');
  }

  return context;
}
