import AppScreen from '@/components/ui/app-screen';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import SectionCard from '@/components/ui/section-card';
import { Colors, Spacing } from '@/constants/theme';
import { useTrackify } from '@/context/TrackifyContext';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { colors, login } = useTrackify();
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const submit = async () => {
    const result = await login(username, password);

    if (!result.ok) {
      setError(result.error ?? 'Unable to login.');
      return;
    }

    setError('');
    router.replace('/(tabs)' as Href);
  };

  return (
    <AppScreen centered>
      <View style={styles.heroPanel}>
        <Text style={[styles.heroKicker, { color: colors.tint }]}>TRACKIFY</Text>
        <Text style={[styles.heroTitle, { color: colors.text }]}>Build better streaks.</Text>
        <Text style={[styles.heroCopy, { color: colors.mutedText }]}>
          Local-first habit tracking with targets, charts, reminders, and CSV export.
        </Text>
      </View>

      <ScreenHeader title="Login" subtitle="Continue to your local habit profile." />

      <SectionCard>
        <FormField
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="demo"
        />
        <FormField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="password"
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <PrimaryButton label="Login" onPress={submit} />
        <View style={styles.buttonSpacing}>
          <PrimaryButton
            label="Create Profile"
            variant="secondary"
            onPress={() => router.push('/register' as Href)}
          />
        </View>
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heroPanel: {
    marginBottom: Spacing.xxl,
  },
  heroKicker: {
    fontSize: 12,
    fontWeight: '900',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    marginTop: Spacing.xs,
  },
  heroCopy: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: Spacing.sm,
  },
  errorText: {
    color: Colors.light.danger,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  buttonSpacing: {
    marginTop: Spacing.sm,
  },
});
