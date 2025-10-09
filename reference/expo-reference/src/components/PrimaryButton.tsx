import { PropsWithChildren, type ReactElement } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { getNavigationTheme } from '@/styles/theme';

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

type PrimaryButtonProps = PropsWithChildren<{
  disabled?: boolean;
  onPress: () => void;
}>;

export function PrimaryButton({ children, disabled, onPress }: PrimaryButtonProps): ReactElement {
  const colorScheme = useColorScheme();
  const theme = getNavigationTheme(colorScheme);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => {
        return [
          styles.button,
          {
            backgroundColor: disabled ? theme.colors.border : theme.colors.primary,
            opacity: pressed ? 0.9 : 1,
          },
        ];
      }}
    >
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.primaryText,
          },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}
