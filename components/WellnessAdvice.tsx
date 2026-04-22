import PrimaryButton from '@/components/ui/primary-button';
import SectionCard from '@/components/ui/section-card';
import { Colors, Spacing } from '@/constants/theme';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type AdviceResponse = {
  slip?: {
    id: number;
    advice: string;
  };
};

export default function WellnessAdvice() {
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAdvice = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.adviceslip.com/advice');

      if (!response.ok) {
        throw new Error('Advice service is unavailable.');
      }

      const data = (await response.json()) as AdviceResponse;
      const nextAdvice = data.slip?.advice;

      if (!nextAdvice) {
        throw new Error('Advice response was empty.');
      }

      setAdvice(nextAdvice);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load advice.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAdvice();
  }, [loadAdvice]);

  return (
    <SectionCard>
      <Text style={styles.title}>Wellness prompt</Text>
      <Text style={styles.caption}>Fetched from a public advice API.</Text>

      {isLoading ? (
        <Text style={styles.body}>Loading advice...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <Text style={styles.body}>{advice}</Text>
      )}

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Refresh Prompt" variant="secondary" compact onPress={loadAdvice} />
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: '800',
  },
  caption: {
    color: Colors.light.mutedText,
    fontSize: 13,
    marginTop: 2,
  },
  body: {
    color: Colors.light.text,
    fontSize: 16,
    lineHeight: 23,
    marginTop: Spacing.md,
  },
  error: {
    color: Colors.light.danger,
    fontWeight: '700',
    marginTop: Spacing.md,
  },
  buttonSpacing: {
    marginTop: Spacing.sm,
  },
});
