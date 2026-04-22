import { useTrackify } from '@/context/TrackifyContext';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const { colors } = useTrackify();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Habits' }}
      />
      <Tabs.Screen
        name="categories"
        options={{ title: 'Categories' }}
      />
      <Tabs.Screen
        name="targets"
        options={{ title: 'Targets' }}
      />
      <Tabs.Screen
        name="insights"
        options={{ title: 'Insights' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
      />
    </Tabs>
  );
}
