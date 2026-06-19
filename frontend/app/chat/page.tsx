import { Sidebar } from '@/components/chat/Sidebar';

export default function ChatIndexPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center text-zinc-400 text-sm">
        Select a conversation to start chatting
      </main>
    </div>
  );
}
