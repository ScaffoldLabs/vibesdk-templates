import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useMemo, type ReactElement } from 'react';

import { useColorScheme } from './src/hooks/useColorScheme';
import { QueryProvider } from './src/providers/QueryProvider';
import { RootStackParamList } from './src/types/navigation';
import { ChatScreen } from './src/screens/ChatScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { getNavigationTheme } from './src/styles/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): ReactElement {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => getNavigationTheme(colorScheme), [colorScheme]);

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <NavigationContainer theme={theme.navigationTheme}>
          <StatusBar style={theme.statusBarStyle} />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
