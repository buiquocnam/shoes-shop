import { z } from "zod";

export const createConversationSchema = z.object({
  senderId: z.string().min(1, "Sender ID is required"),
  senderName: z.string().min(1, "Sender name is required"),
  participantId: z.string().min(1, "Participant ID is required"),
  participantName: z.string().min(1, "Participant name is required"),
});

export const createMessageSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  message: z.string().min(1, "Message cannot be empty"),
  senderId: z.string().min(1, "Sender ID is required"),
  senderName: z.string().min(1, "Sender name is required"),
});

export type CreateConversationFormData = z.infer<
  typeof createConversationSchema
>;
export type CreateMessageFormData = z.infer<typeof createMessageSchema>;

