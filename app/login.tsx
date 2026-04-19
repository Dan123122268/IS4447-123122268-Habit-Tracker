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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useTrackify();
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Trackify" subtitle="Login to your local habit profile." />

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
