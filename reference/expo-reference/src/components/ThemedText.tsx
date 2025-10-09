import { PropsWithChildren, type ReactElement } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { getNavigationTheme } from '@/styles/theme';

type TextVariant = 'title' | 'subtitle' | 'body' | 'caption';

type ThemedTextProps = PropsWithChildren<{
  variant?: TextVariant;
}> &
  TextProps;

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
  },
});

const variantToStyle: Record<TextVariant, keyof typeof styles> = {
  title: 'title',
  subtitle: 'subtitle',
  body: 'body',
  caption: 'caption',
};

export function ThemedText({ children, style, variant = 'body', ...props }: ThemedTextProps): ReactElement {
  const colorScheme = useColorScheme();
  const theme = getNavigationTheme(colorScheme);
  const styleKey: keyof typeof styles = variantToStyle[variant];
  const textStyle = styles[styleKey];

  return (
    <Text
      {...props}
      style={[
        textStyle,
        {
          color: variant === 'title' ? theme.navigationTheme.colors.text : theme.colors.secondaryText,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
