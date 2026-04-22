import PrimaryButton from '@/components/ui/primary-button';
import SectionCard from '@/components/ui/section-card';
import { Colors, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type AdviceResponse = {
  text?: string;
};

const fallbackPrompts = [
  'Take two minutes to log one honest habit entry and notice what helped or got in the way.',
  'Pick one habit for today and make the next action small enough that you can start immediately.',
  'Check your weekly target and write one sentence about what would make tomorrow easier.',
  'Pause, breathe, and choose one routine that supports your energy rather than just your streak.',
];

const wellnessFrames = [
  'Reflection prompt',
  'Mindful habit nudge',
  'Consistency check',
  'Wellbeing reset',
];

const buildWellnessPrompt = (seedText?: string) => {
  if (!seedText) return fallbackPrompts[0];

  const seed = seedText
    .split('')
    .reduce((total, character) => total + character.charCodeAt(0), 0);
  const prompt = fallbackPrompts[seed % fallbackPrompts.length];
  const frame = wellnessFrames[seed % wellnessFrames.length];

  return `${frame}: ${prompt}`;
};

export default function WellnessAdvice() {
  const colors = useThemeColors();
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAdvice = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');

      if (!response.ok) {
        throw new Error('Advice service is unavailable.');
      }

      const data = (await response.json()) as AdviceResponse;
      const nextAdvice = data.text;

      if (!nextAdvice) {
        throw new Error('Advice response was empty.');
      }

      setAdvice(buildWellnessPrompt(nextAdvice));
    } catch {
      setAdvice(buildWellnessPrompt());
      setError('Showing offline wellness prompt.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAdvice();
  }, [loadAdvice]);

  return (
    <SectionCard>
      <Text style={[styles.title, { color: colors.text }]}>Wellness prompt</Text>
      <Text style={[styles.caption, { color: colors.mutedText }]}>
        Generated from a public API signal with offline fallback.
      </Text>

      {isLoading ? (
        <Text style={[styles.body, { color: colors.text }]}>Loading advice...</Text>
      ) : error ? (
        <>
          <Text style={[styles.body, { color: colors.text }]}>{advice}</Text>
          <Text style={styles.notice}>{error}</Text>
        </>
      ) : (
        <Text style={[styles.body, { color: colors.text }]}>{advice}</Text>
      )}

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Refresh Prompt" variant="secondary" compact onPress={loadAdvice} />
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  caption: {
    fontSize: 13,
    marginTop: 2,
  },
  body: {
    fontSize: 16,
    lineHeight: 23,
    marginTop: Spacing.md,
  },
  notice: {
    color: Colors.light.warning,
    fontSize: 12,
    fontWeight: '700',
    marginTop: Spacing.md,
  },
  buttonSpacing: {
    marginTop: Spacing.sm,
  },
});

