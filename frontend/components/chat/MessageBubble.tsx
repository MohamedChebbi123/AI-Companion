import { cn } from '@/lib/utils';
import type { Message } from '@/services/chatService';

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed',
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-zinc-100 text-zinc-900 rounded-bl-sm dark:bg-zinc-800 dark:text-zinc-100'
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
