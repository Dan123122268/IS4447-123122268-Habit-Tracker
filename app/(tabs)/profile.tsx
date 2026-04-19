import InfoTag from '@/components/ui/info-tag';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import SectionCard from '@/components/ui/section-card';
import { Colors, Spacing } from '@/constants/theme';
import { useTrackify } from '@/context/TrackifyContext';
import { Href, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    activeUser,
    categories,
    deleteProfile,
    habits,
    logs,
    logout,
    targets,
  } = useTrackify();

  const handleLogout = async () => {
    await logout();
    router.replace('/login' as Href);
  };

  const handleDeleteProfile = async () => {
    await deleteProfile();
    router.replace('/register' as Href);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Profile" subtitle="Local-only account and data controls." />

        {!activeUser ? (
          <SectionCard>
            <Text style={styles.emptyText}>No profile is currently logged in.</Text>
            <View style={styles.buttonSpacing}>
              <PrimaryButton label="Login" onPress={() => router.replace('/login' as Href)} />
            </View>
          </SectionCard>
        ) : (
          <>
            <SectionCard>
              <Text style={styles.username}>{activeUser.username}</Text>
              <Text style={styles.meta}>Created {activeUser.createdAt}</Text>
              <View style={styles.tags}>
                <InfoTag label="Habits" value={String(habits.length)} />
                <InfoTag label="Logs" value={String(logs.length)} />
                <InfoTag label="Targets" value={String(targets.length)} />
                <InfoTag label="Categories" value={String(categories.length)} />
              </View>
            </SectionCard>

            <SectionCard>
              <Text style={styles.sectionTitle}>Privacy</Text>
              <Text style={styles.meta}>
                Trackify stores habit data locally on this device using SQLite. No backend
                account, API secret, or remote database is used.
              </Text>
            </SectionCard>

            <PrimaryButton label="Logout" variant="secondary" onPress={handleLogout} />
            <View style={styles.buttonSpacing}>
              <PrimaryButton
                label="Delete Profile"
                variant="danger"
                onPress={handleDeleteProfile}
              />
            </View>
          </>
        )}
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
    paddingBottom: Spacing.xxl,
  },
  username: {
    color: Colors.light.text,
    fontSize: 26,
    fontWeight: '900',
  },
  meta: {
    color: Colors.light.mutedText,
    fontSize: 14,
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    color: Colors.light.mutedText,
  },
  buttonSpacing: {
    marginTop: Spacing.sm,
  },
});
