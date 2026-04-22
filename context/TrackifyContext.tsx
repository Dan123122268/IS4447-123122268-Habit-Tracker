import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { and, eq } from 'drizzle-orm';
import { Colors, ThemeMode, ThemeName } from '@/constants/theme';
import { ThemeColorsProvider } from '@/context/ThemeContext';
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
import { hashPassword, isValidPassword, isValidUsername } from '@/utils/auth';
import { todayIso } from '@/utils/date';

type AuthResult = {
  ok: boolean;
  error?: string;
};

type TrackifyContextType = {
  categories: Category[];
  habits: Habit[];
  logs: HabitLog[];
  targets: Target[];
  settings: Setting[];
  activeUser: User | null;
  isLoading: boolean;
  themeMode: ThemeMode;
  themeName: ThemeName;
  colors: typeof Colors.light;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setUserSetting: (key: string, value: string | null) => Promise<void>;
  refreshData: () => Promise<void>;
  login: (username: string, password: string) => Promise<AuthResult>;
  register: (username: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  deleteProfile: () => Promise<void>;
};

const TrackifyContext = createContext<TrackifyContextType | null>(null);

type Props = {
  children: ReactNode;
};

const defaultCategoryTemplates = [
  { name: 'Fitness', colour: '#0F766E', icon: 'fitness-outline' },
  { name: 'Learning', colour: '#2563EB', icon: 'book-outline' },
  { name: 'Wellbeing', colour: '#C2410C', icon: 'heart-outline' },
];

export function TrackifyProvider({ children }: Props) {
  const systemScheme = useColorScheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const themeMode =
    (settings.find((setting) => setting.key === 'theme')?.value as ThemeMode | undefined) ??
    'system';
  const themeName: ThemeName =
    themeMode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : themeMode;
  const colors = Colors[themeName];

  const setActiveSession = async (userId: number) => {
    await db.delete(settingsTable).where(eq(settingsTable.key, 'active_user_id'));
    await db.insert(settingsTable).values({
      userId,
      key: 'active_user_id',
      value: String(userId),
    });
  };

  const clearSession = async () => {
    await db.delete(settingsTable).where(eq(settingsTable.key, 'active_user_id'));
  };

  const refreshData = useCallback(async () => {
    const [userRows, settingRows] = await Promise.all([
      db.select().from(usersTable),
      db.select().from(settingsTable),
    ]);
    const sessionSetting = settingRows.find((setting) => setting.key === 'active_user_id');
    const sessionUserId = sessionSetting ? Number(sessionSetting.value) : null;
    const currentUser = userRows.find((user) => user.id === sessionUserId) ?? null;

    if (!currentUser) {
      setActiveUser(null);
      setCategories([]);
      setHabits([]);
      setLogs([]);
      setTargets([]);
      setSettings([]);
      return;
    }

    const [categoryRows, habitRows, logRows, targetRows, userSettingRows] =
      await Promise.all([
        db
          .select()
          .from(categoriesTable)
          .where(eq(categoriesTable.userId, currentUser.id)),
        db
          .select()
          .from(habitsTable)
          .where(eq(habitsTable.userId, currentUser.id)),
        db
          .select()
          .from(habitLogsTable)
          .where(eq(habitLogsTable.userId, currentUser.id)),
        db
          .select()
          .from(targetsTable)
          .where(eq(targetsTable.userId, currentUser.id)),
        db
          .select()
          .from(settingsTable)
          .where(eq(settingsTable.userId, currentUser.id)),
      ]);

    setActiveUser(currentUser);
    setCategories(categoryRows);
    setHabits(habitRows);
    setLogs(logRows);
    setTargets(targetRows);
    setSettings(userSettingRows);
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const trimmedUsername = username.trim().toLowerCase();
      const rows = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, trimmedUsername));
      const user = rows[0];

      const isPasswordMatch =
        user?.passwordHash === hashPassword(trimmedUsername, password) ||
        (user?.username === 'demo' &&
          user.passwordHash === 'local-demo-password' &&
          password === 'password');

      if (!user || !isPasswordMatch) {
        return { ok: false, error: 'Username or password is incorrect.' };
      }

      await setActiveSession(user.id);
      await refreshData();
      return { ok: true };
    },
    [refreshData]
  );

  const register = useCallback(
    async (username: string, password: string) => {
      const trimmedUsername = username.trim().toLowerCase();

      if (!isValidUsername(trimmedUsername)) {
        return { ok: false, error: 'Username must be at least 3 characters.' };
      }

      if (!isValidPassword(password)) {
        return { ok: false, error: 'Password must be at least 6 characters.' };
      }

      const existing = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, trimmedUsername));

      if (existing.length > 0) {
        return { ok: false, error: 'That username is already registered.' };
      }

      const insertedUsers = await db
        .insert(usersTable)
        .values({
          username: trimmedUsername,
          passwordHash: hashPassword(trimmedUsername, password),
          createdAt: todayIso(),
        })
        .returning();
      const newUser = insertedUsers[0];

      await db.insert(categoriesTable).values(
        defaultCategoryTemplates.map((category) => ({
          userId: newUser.id,
          ...category,
        }))
      );
      await db.insert(settingsTable).values({
        userId: newUser.id,
        key: 'theme',
        value: 'system',
      });
      await setActiveSession(newUser.id);
      await refreshData();

      return { ok: true };
    },
    [refreshData]
  );

  const logout = useCallback(async () => {
    await clearSession();
    await refreshData();
  }, [refreshData]);

  const deleteProfile = useCallback(async () => {
    if (!activeUser) return;

    await clearSession();
    await db.delete(habitLogsTable).where(eq(habitLogsTable.userId, activeUser.id));
    await db.delete(targetsTable).where(eq(targetsTable.userId, activeUser.id));
    await db.delete(habitsTable).where(eq(habitsTable.userId, activeUser.id));
    await db.delete(categoriesTable).where(eq(categoriesTable.userId, activeUser.id));
    await db.delete(settingsTable).where(eq(settingsTable.userId, activeUser.id));
    await db
      .delete(usersTable)
      .where(and(eq(usersTable.id, activeUser.id), eq(usersTable.username, activeUser.username)));
    await refreshData();
  }, [activeUser, refreshData]);

  const setThemeMode = useCallback(
    async (mode: ThemeMode) => {
      if (!activeUser) return;

      await db
        .delete(settingsTable)
        .where(and(eq(settingsTable.userId, activeUser.id), eq(settingsTable.key, 'theme')));
      await db.insert(settingsTable).values({
        userId: activeUser.id,
        key: 'theme',
        value: mode,
      });
      await refreshData();
    },
    [activeUser, refreshData]
  );

  const setUserSetting = useCallback(
    async (key: string, value: string | null) => {
      if (!activeUser) return;

      await db
        .delete(settingsTable)
        .where(and(eq(settingsTable.userId, activeUser.id), eq(settingsTable.key, key)));

      if (value !== null) {
        await db.insert(settingsTable).values({
          userId: activeUser.id,
          key,
          value,
        });
      }

      await refreshData();
    },
    [activeUser, refreshData]
  );

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
        themeMode,
        themeName,
        colors,
        setThemeMode,
        setUserSetting,
        refreshData,
        login,
        register,
        logout,
        deleteProfile,
      }}
    >
      <ThemeColorsProvider colors={colors}>{children}</ThemeColorsProvider>
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

export function useOptionalTrackify() {
  return useContext(TrackifyContext);
}
