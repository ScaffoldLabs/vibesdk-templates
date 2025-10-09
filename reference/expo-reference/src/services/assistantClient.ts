import Constants from 'expo-constants';
import { z } from 'zod';

import type { AssistantMessage } from '@/types/thread';
import { createAssistantMessage } from '@/utils/createAssistantMessage';

const configExtraSchema = z
  .object({
    apiBaseUrl: z.string().url().or(z.string().regex(/^https?:\/\//)),
  })
  .partial();

const messageSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  role: z.union([z.literal('assistant'), z.literal('user')]),
  content: z.string(),
  createdAt: z.string(),
});

const messageListResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(messageSchema),
});

const messageResponseSchema = z.object({
  success: z.literal(true),
  data: messageSchema,
});

type ApiResult<T> = {
  success: true;
  data: T;
};

type SendMessageInput = {
  threadId: string;
  content: string;
};

function resolveApiBaseUrl(): string {
  const extra = configExtraSchema.parse(Constants.expoConfig?.extra ?? {});
  if (extra.apiBaseUrl) {
    return extra.apiBaseUrl.replace(/\/$/, '');
  }
  return 'http://127.0.0.1:8787';
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = resolveApiBaseUrl();
  const headers = new Headers(init?.headers ?? {});
  headers.set('content-type', 'application/json');

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Request failed (${String(response.status)}): ${errorBody}`);
  }

  return (await response.json()) as T;
}

export async function fetchThreadMessages(threadId: string): Promise<AssistantMessage[]> {
  const result = await request<ApiResult<AssistantMessage[]>>(`/api/threads/${threadId}/messages`);
  return messageListResponseSchema.parse(result).data;
}

export async function sendThreadMessage({ threadId, content }: SendMessageInput): Promise<AssistantMessage> {
  const result = await request<ApiResult<AssistantMessage>>(`/api/threads/${threadId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });

  const { data } = messageResponseSchema.parse(result);
  return data;
}

export function createLocalUserMessage(threadId: string, content: string): AssistantMessage {
  return createAssistantMessage({ threadId, content, role: 'user' });
}
