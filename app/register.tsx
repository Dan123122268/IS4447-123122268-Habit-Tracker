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

export default function RegisterScreen() {
  const router = useRouter();
  const { colors, register } = useTrackify();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    if (password !== confirmPassword) {
      setError('Passwords must match.');
      return;
    }

    const result = await register(username, password);

    if (!result.ok) {
      setError(result.error ?? 'Unable to register.');
      return;
    }

    setError('');
    router.replace('/(tabs)' as Href);
  };

  return (
    <AppScreen centered>
      <View style={styles.heroPanel}>
        <Text style={[styles.heroKicker, { color: colors.tint }]}>LOCAL ONLY</Text>
        <Text style={[styles.heroTitle, { color: colors.text }]}>Create your profile.</Text>
        <Text style={[styles.heroCopy, { color: colors.mutedText }]}>
          Your habits, logs, targets, and settings stay on this device.
        </Text>
      </View>

      <ScreenHeader title="Create Profile" subtitle="Your data stays local on this device." />

      <SectionCard>
        <FormField
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="at least 3 characters"
        />
        <FormField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="at least 6 characters"
          secureTextEntry
        />
        <FormField
          label="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="repeat password"
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <PrimaryButton label="Register" onPress={submit} />
        <View style={styles.buttonSpacing}>
          <PrimaryButton
            label="Back to Login"
            variant="secondary"
            onPress={() => router.replace('/login' as Href)}
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
    fontSize: 34,
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
