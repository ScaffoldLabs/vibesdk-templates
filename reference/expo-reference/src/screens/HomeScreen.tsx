import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, type ReactElement } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { GradientCard } from '@/components/GradientCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getNavigationTheme } from '@/styles/theme';
import type { RootStackParamList } from '@/types/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    gap: 24,
  },
  featureCard: {
    gap: 12,
  },
  buttonWrapper: {
    marginTop: 12,
  },
});

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const features = [
  {
    title: 'Agentic workflows',
    description: 'Bootstrap multi-turn assistants that run against Cloudflare Workers APIs with persistence-ready patterns.',
  },
  {
    title: 'Realtime previews',
    description: 'Instant Expo Go reloads help you iterate on flows while the Worker backend runs locally.',
  },
  {
    title: 'Production guardrails',
    description: 'Strict typing, query caching, and tested utilities help you ship confidently to the stores.',
  },
] as const;

function createThreadId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `thread-${Math.random().toString(36).slice(2, 10)}`;
}

export function HomeScreen(): ReactElement {
  const navigation = useNavigation<Navigation>();
  const colorScheme = useColorScheme();
  const theme = getNavigationTheme(colorScheme);

  const handleStartPress = useCallback(() => {
    navigation.navigate('Chat', { threadId: createThreadId() });
  }, [navigation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={{ gap: 24 }}>
        <ThemedText variant="title">Mobile-first agent playground</ThemedText>
        <ThemedText>
          Ship Expo Go experiences backed by Cloudflare Workers. This template wires up a typed chat assistant, offline-aware
          React Query cache, and delightful theming out of the box.
        </ThemedText>
      </View>

      <GradientCard>
        <View style={styles.featureCard}>
          <ThemedText variant="subtitle" style={{ color: theme.navigationTheme.colors.text }}>
            Build rapidly with Expo
          </ThemedText>
          <ThemedText>
            Use this starter to create authenticated assistants, dashboards, or personal productivity tools that run anywhere
            Expo Go runs.
          </ThemedText>
          <View style={styles.buttonWrapper}>
            <PrimaryButton onPress={handleStartPress}>Start a new conversation</PrimaryButton>
          </View>
        </View>
      </GradientCard>

      <View style={{ gap: 24 }}>
        {features.map((feature) => (
          <GradientCard key={feature.title}>
            <View style={styles.featureCard}>
              <ThemedText variant="subtitle" style={{ color: theme.navigationTheme.colors.text }}>
                {feature.title}
              </ThemedText>
              <ThemedText>{feature.description}</ThemedText>
            </View>
          </GradientCard>
        ))}
      </View>
    </ScrollView>
  );
}
