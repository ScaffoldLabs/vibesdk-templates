import { memo, useMemo, type ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { ColorScheme } from '@/types/theme';
import type { AssistantMessage } from '@/types/thread';
import { getNavigationTheme } from '@/styles/theme';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  messageContainer: {
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 6,
    opacity: 0.7,
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  assistantWrapper: {
    justifyContent: 'flex-start',
  },
});

type MessageBubbleProps = {
  message: AssistantMessage;
  colorScheme: ColorScheme;
};

export const MessageBubble = memo(({ message, colorScheme }: MessageBubbleProps): ReactElement => {
  const theme = getNavigationTheme(colorScheme);
  const isUser = message.role === 'user';

  const timestampLabel = useMemo(() => {
    const date = new Date(message.createdAt);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }, [message.createdAt]);

  return (
    <View style={[styles.wrapper, isUser ? styles.userWrapper : styles.assistantWrapper]}>
      <View
        style={[
          styles.messageContainer,
          {
            backgroundColor: isUser ? theme.colors.primary : theme.colors.surface,
            borderBottomRightRadius: isUser ? 4 : 20,
            borderBottomLeftRadius: isUser ? 20 : 4,
          },
        ]}
      >
        <Text
          style={{
            color: isUser ? theme.colors.primaryText : theme.colors.secondaryText,
            fontSize: 16,
            lineHeight: 22,
          }}
        >
          {message.content}
        </Text>
        {timestampLabel ? (
          <Text
            style={[
              styles.timestamp,
              {
                color: isUser ? theme.colors.primaryText : theme.colors.secondaryText,
              },
            ]}
          >
            {timestampLabel}
          </Text>
        ) : null}
      </View>
    </View>
  );
});

MessageBubble.displayName = 'MessageBubble';
