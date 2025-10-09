import { ConfigContext, ExpoConfig } from 'expo/config';

type ExtraConfig = {
  apiBaseUrl: string;
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Expo Reference',
  slug: 'expo-reference',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'expo-reference',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0f172a',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0f172a',
    },
  },
  web: {
    bundler: 'metro',
    favicon: './assets/icon.png',
  },
  experiments: {
    tsconfigPaths: true,
  },
  extra: {
    apiBaseUrl: process.env.API_BASE_URL ?? 'http://127.0.0.1:8787',
  } satisfies ExtraConfig,
});
