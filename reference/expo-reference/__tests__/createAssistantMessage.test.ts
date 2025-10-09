import { createAssistantMessage } from '../src/utils/createAssistantMessage';

describe('createAssistantMessage', () => {
  it('creates a message with provided fields', () => {
    const message = createAssistantMessage({
      threadId: 'thread-123',
      role: 'assistant',
      content: 'Hello!',
      createdAt: '2024-01-01T00:00:00.000Z',
    });

    expect(message).toEqual({
      id: 'thread-123-2024-01-01T00:00:00.000Z',
      threadId: 'thread-123',
      role: 'assistant',
      content: 'Hello!',
      createdAt: '2024-01-01T00:00:00.000Z',
    });
  });

  it('fills in missing timestamp', () => {
    const message = createAssistantMessage({ threadId: 'thread-1', role: 'user', content: 'Hi' });
    expect(message.createdAt).toBeTruthy();
    expect(message.id.startsWith('thread-1-')).toBe(true);
  });
});
