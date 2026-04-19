import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import SectionCard from '@/components/ui/section-card';
import { Colors, Spacing } from '@/constants/theme';
import { useTrackify } from '@/context/TrackifyContext';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useTrackify();
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.light.background,
    flex: 1,
    padding: Spacing.xl,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: Spacing.xxl,
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
