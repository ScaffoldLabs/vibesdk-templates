import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { MessageBubble } from '@/components/MessageBubble';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { fetchThreadMessages, sendThreadMessage, createLocalUserMessage } from '@/services/assistantClient';
import { getNavigationTheme } from '@/styles/theme';
import type { AssistantMessage } from '@/types/thread';
import type { RootStackParamList } from '@/types/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 140,
    gap: 12,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    gap: 8,
  },
  composer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: 'transparent',
    gap: 8,
  },
  composerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
});

type ChatRoute = RouteProp<RootStackParamList, 'Chat'>;

type ComposerState = {
  value: string;
  isSending: boolean;
};

export function ChatScreen(): ReactElement {
  const { params } = useRoute<ChatRoute>();
  const colorScheme = useColorScheme();
  const theme = getNavigationTheme(colorScheme);

  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [{ value, isSending }, setComposerState] = useState<ComposerState>({ value: '', isSending: false });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const loadMessages = async (): Promise<void> => {
      try {
        const threadMessages = await fetchThreadMessages(params.threadId);
        if (mountedRef.current) {
          setMessages(threadMessages);
        }
      } catch (error) {
        console.warn('Failed to load messages', error);
      }
    };

    void loadMessages();

    return () => {
      mountedRef.current = false;
    };
  }, [params.threadId]);

  const handleSend = useCallback(async () => {
    const trimmed = value.trim();
    if (!trimmed || isSending) {
      return;
    }

    setComposerState({ value: '', isSending: true });
    const userMessage = createLocalUserMessage(params.threadId, trimmed);
    setMessages((prev: AssistantMessage[]) => [...prev, userMessage]);

    try {
      const assistantMessage = await sendThreadMessage({ threadId: params.threadId, content: trimmed });
      if (mountedRef.current) {
        setMessages((prev: AssistantMessage[]) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.warn('sendThreadMessage failed', error);
      if (mountedRef.current) {
        setMessages((prev: AssistantMessage[]) => prev.filter((message) => message.id !== userMessage.id));
        setComposerState({ value: trimmed, isSending: false });
        return;
      }
    }

    if (mountedRef.current) {
      setComposerState({ value: '', isSending: false });
    }
  }, [value, isSending, params.threadId]);

  const renderItem = useCallback(
    ({ item }: { item: AssistantMessage }) => <MessageBubble colorScheme={colorScheme} message={item} />,
    [colorScheme]
  );

  const keyExtractor = useCallback((item: AssistantMessage) => item.id, []);

  const placeholder = useMemo(
    () => (isSending ? 'Generating response…' : 'Ask the assistant anything…'),
    [isSending]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      enabled
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={messages}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText variant="title">Assistant workspace</ThemedText>
            <ThemedText>
              Draft prompts, capture notes, and test multi-step agents using the Expo Go client. Responses stream from the
              Worker-backed inference endpoint included with this template.
            </ThemedText>
          </View>
        }
      />

      <View style={[styles.composer, { backgroundColor: theme.colors.card, borderTopWidth: 1, borderTopColor: theme.colors.border }]}>
        <View style={[styles.composerRow]}>
          <TextInput
            accessibilityLabel="Message composer"
            multiline
            onChangeText={(text: string) => {
              setComposerState({ value: text, isSending });
            }}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.secondaryText}
            style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.navigationTheme.colors.text }]}
            value={value}
          />
          <View style={{ justifyContent: 'center' }}>
            <PrimaryButton
              disabled={isSending || !value.trim()}
              onPress={() => {
                void handleSend();
              }}
            >
              {isSending ? 'Sending…' : 'Send'}
            </PrimaryButton>
          </View>
        </View>
        {isSending ? <ActivityIndicator color={theme.navigationTheme.colors.primary} /> : null}
      </View>
    </KeyboardAvoidingView>
  );
}
