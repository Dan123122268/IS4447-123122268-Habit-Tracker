import { Spacing } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  centered?: boolean;
  scroll?: boolean;
};

export default function AppScreen({ children, centered = false, scroll = true }: Props) {
  const colors = useThemeColors();

  const content = (
    <View style={[styles.inner, centered && styles.centered]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.screenBottom,
  },
  inner: {
    alignSelf: 'center',
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 780,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
});
