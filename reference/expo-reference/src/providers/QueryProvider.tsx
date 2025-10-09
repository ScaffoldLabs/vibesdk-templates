import { PropsWithChildren, useEffect, type ReactElement } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
    mutations: {
      retry: 1,
    },
  },
});

function useReactNativeFocusManager(): void {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
      if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);
}

export function QueryProvider({ children }: PropsWithChildren): ReactElement {
  useReactNativeFocusManager();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
