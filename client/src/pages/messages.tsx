import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRecentConversations, useMessages, useSendMessage } from "@/hooks/use-messages";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { Send, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const { user } = useAuth();
  const { data: conversations, isLoading: loadingConvos } = useRecentConversations();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-140px)] bg-card border border-border/50 rounded-2xl shadow-sm flex overflow-hidden">
        {/* Sidebar List */}
        <div className="w-80 border-r border-border/50 flex flex-col bg-secondary/10">
          <div className="p-4 border-b border-border/50">
            <h2 className="font-bold text-lg">Messages</h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {loadingConvos ? (
                <div className="text-center py-4 text-sm text-muted-foreground">Loading chats...</div>
              ) : conversations?.length === 0 ? (
                <div className="text-center py-4 text-sm text-muted-foreground">No conversations yet</div>
              ) : (
                conversations?.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedUserId(conv.id)}
                    className={cn(
                      "p-3 rounded-xl cursor-pointer transition-colors hover:bg-secondary",
                      selectedUserId === conv.id ? "bg-primary/10 border border-primary/20" : "bg-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {conv.firstName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-semibold text-sm truncate">{conv.firstName} {conv.lastName}</h4>
                          <span className="text-[10px] text-muted-foreground">
                            {conv.lastMessageTime ? format(new Date(conv.lastMessageTime), "h:mm a") : ""}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-background">
          {selectedUserId ? (
            <ChatWindow receiverId={selectedUserId} currentUserId={user!.id} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-2">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-2">
                <User className="w-8 h-8 opacity-50" />
              </div>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function ChatWindow({ receiverId, currentUserId }: { receiverId: string, currentUserId: string }) {
  const { data: messages, isLoading } = useMessages(receiverId);
  const { mutate: sendMessage } = useSendMessage();
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage({
      senderId: currentUserId,
      receiverId: receiverId,
      content: inputValue,
    });
    setInputValue("");
  };

  return (
    <>
      {/* Messages Feed */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center text-sm text-muted-foreground">Loading messages...</div>
          ) : (
            messages?.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm",
                      isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-secondary text-secondary-foreground rounded-bl-none"
                    )}
                  >
                    {msg.content}
                    <div className={cn("text-[10px] mt-1 opacity-70", isMe ? "text-right" : "text-left")}>
                      {format(new Date(msg.createdAt!), "h:mm a")}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-card">
        <div className="flex gap-2">
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="rounded-xl border-border/50 focus-visible:ring-primary/20"
          />
          <Button onClick={handleSend} size="icon" className="rounded-xl h-10 w-10 shrink-0 bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
