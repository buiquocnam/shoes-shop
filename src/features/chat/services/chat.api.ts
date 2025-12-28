import axiosInstance from "@/lib/axios";
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
  ) => {
    const response = await axiosInstance.post<Conversation>(
      "/chat/conversations/create",
      data
    );
    return response.data;
  },

  /**
   * Send a message to a conversation
   */
  sendMessage: async (data: CreateMessageRequest) => {
    const response = await axiosInstance.post<Message>(
      "/chat/messages/create",
      data
    );
    return response.data;
  },

  /**
   * Get messages by conversation ID
   */
  getMessagesByConversationId: async (
    conversationId: string
  ) => {
    const response = await axiosInstance.get<Message[]>(
      `/chat/messages/chat/detail?conversationId=${conversationId}`
    );
    return response.data;
  },

  /**
   * Get messages by current user ID (from JWT)
   */
  getMessagesByUserId: async () => {
    const response = await axiosInstance.get<Message[]>("/chat/messages/user");
    return response.data;
  },
};
