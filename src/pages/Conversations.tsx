
import { AppLayout } from "@/components/layout/AppLayout";
import { ConversationList } from "@/components/conversations/ConversationList";
import { ChatWindow } from "@/components/conversations/ChatWindow";

export default function Conversations() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Conversations</h1>
          <p className="text-muted-foreground">
            Manage all your customer communications in one place
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <div className="lg:col-span-1">
          <ConversationList />
        </div>
        <div className="lg:col-span-2">
          <ChatWindow />
        </div>
      </div>
    </AppLayout>
  );
}
