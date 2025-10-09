import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren, type ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { getNavigationTheme } from '@/styles/theme';

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 1,
    overflow: 'hidden',
  },
  inner: {
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
});

type GradientCardProps = PropsWithChildren;

export function GradientCard({ children }: GradientCardProps): ReactElement {
  const colorScheme = useColorScheme();
  const theme = getNavigationTheme(colorScheme);

  const gradientColors = colorScheme === 'dark'
    ? ['#1a2960', '#0f172a']
    : ['#60a5fa', '#2563eb'];

  return (
    <LinearGradient colors={gradientColors} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View
        style={[
          styles.inner,
          {
            backgroundColor: theme.colors.surface,
          },
        ]}
      >
        {children}
      </View>
    </LinearGradient>
  );
}
