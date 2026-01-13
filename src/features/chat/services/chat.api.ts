import axiosInstance from "@/lib/axios";
import type {
  Conversation,
  Message,
  CreateConversationRequest,
  CreateMessageRequest,
} from "../types";

export const chatApi = {
  createConversation: async (
    data: CreateConversationRequest
  ) => {
    const response = await axiosInstance.post<Conversation>(
      "/chat/conversations/create",
      data
    );
    return response.data;
  },

  sendMessage: async (data: CreateMessageRequest) => {
    const response = await axiosInstance.post<Message>(
      "/chat/messages/create",
      data
    );
    return response.data;
  },

  getMessagesByConversationId: async (
    conversationId: string
  ) => {
    const response = await axiosInstance.get<Message[]>(
      `/chat/messages/chat/detail?conversationId=${conversationId}`
    );
    return response.data;
  },

  getMessagesByUserId: async () => {
    const response = await axiosInstance.get<Message[]>("/chat/messages/user");
    return response.data;
  },

  getConversationsList: async () => {
    const response = await axiosInstance.get<Conversation[]>("/chat/conversations/list");
    return response.data;
  },
};
