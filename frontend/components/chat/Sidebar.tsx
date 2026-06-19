'use client';
import Link from 'next/link';
import { useChatStore } from '@/store/chatStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function Sidebar({ activeId }: { activeId?: string }) {
  const conversations = useChatStore((s) => s.conversations);
  const { logout } = useAuth();

  return (
    <aside className="w-64 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
      <div className="p-4 font-semibold text-lg border-b border-zinc-200 dark:border-zinc-800">
        AI Companion
      </div>
      <nav className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {conversations.map((conv) => (
          <Link
            key={conv.id}
            href={`/chat/${conv.id}`}
            className={cn(
              'rounded-lg px-3 py-2 text-sm truncate transition-colors',
              'hover:bg-zinc-200 dark:hover:bg-zinc-800',
              conv.id === activeId &&
                'bg-zinc-200 dark:bg-zinc-800 font-medium'
            )}
          >
            {conv.title}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
        <Link
          href="/settings"
          className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          Settings
        </Link>
        <button
          onClick={logout}
          className="text-sm text-left text-red-500 hover:text-red-700"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
