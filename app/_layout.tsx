import { TrackifyProvider } from '@/context/TrackifyContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <TrackifyProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </TrackifyProvider>
  );
}
