import { AssistantMessage, MessageRole } from '@/types/thread';

export type CreateAssistantMessageInput = {
  threadId: string;
  role: MessageRole;
  content: string;
  createdAt?: string;
};

export function createAssistantMessage({ threadId, role, content, createdAt }: CreateAssistantMessageInput): AssistantMessage {
  const timestamp = createdAt ?? new Date().toISOString();

  return {
    id: `${threadId}-${timestamp}`,
    threadId,
    role,
    content,
    createdAt: timestamp,
  };
}
