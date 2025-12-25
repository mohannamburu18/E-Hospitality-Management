import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertMessage } from "@shared/routes";

export function useMessages(userId: string) {
  return useQuery({
    queryKey: [api.messages.list.path, userId],
    queryFn: async () => {
      const url = buildUrl(api.messages.list.path, { userId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.messages.list.responses[200].parse(await res.json());
    },
    enabled: !!userId,
    refetchInterval: 5000, // Poll every 5s for new messages
  });
}

export function useRecentConversations() {
  return useQuery({
    queryKey: [api.messages.getRecentConversations.path],
    queryFn: async () => {
      const res = await fetch(api.messages.getRecentConversations.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return api.messages.getRecentConversations.responses[200].parse(await res.json());
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertMessage) => {
      const res = await fetch(api.messages.create.path, {
        method: api.messages.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to send message");
      return api.messages.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.messages.list.path, variables.receiverId] });
      queryClient.invalidateQueries({ queryKey: [api.messages.getRecentConversations.path] });
    },
  });
}
