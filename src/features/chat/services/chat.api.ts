import { apiClient } from "@/lib/api";
import type {
  Conversation,
  Message,
  CreateConversationRequest,
  CreateMessageRequest,
} from "../types";

export const chatApi = {
  /**
   * Create a new conversation
   */
  createConversation: async (
    data: CreateConversationRequest
  ): Promise<Conversation> => {
    const response = await apiClient.post<Conversation>(
      "/chat/conversations/create",
      data
    );
    return response.result;
  },

  /**
   * Send a message to a conversation
   */
  sendMessage: async (data: CreateMessageRequest): Promise<Message> => {
    const response = await apiClient.post<Message>(
      "/chat/messages/create",
      data
    );
    return response.result;
  },

  /**
   * Get messages by conversation ID
   */
  getMessagesByConversationId: async (
    conversationId: string
  ): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>(
      `/chat/messages/chat/detail?conversationId=${conversationId}`
    );
    return response.result;
  },

  /**
   * Get messages by current user ID (from JWT)
   */
  getMessagesByUserId: async (): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>("/chat/messages/user");
    return response.result;
  },
};
