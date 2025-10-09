import { useColorScheme as useReactNativeColorScheme } from 'react-native';

import type { ColorScheme } from '@/types/theme';

export function useColorScheme(): ColorScheme {
  const scheme = useReactNativeColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}
