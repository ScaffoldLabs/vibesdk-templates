export type MessageRole = 'user' | 'assistant';

export type AssistantMessage = {
  id: string;
  threadId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
};

export type ThreadState = {
  threadId: string;
  messages: AssistantMessage[];
};
