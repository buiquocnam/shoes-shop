export interface Conversation {
  id: string;
  participantsHash: string | null;
  conversationName: string;
  createdDate: string;
  modifiedDate: string;
}

export interface Message {
  id: string;
  conversationId: string;
  message: string;
  senderId: string;
  senderName: string;
  me: boolean;
  createdDate: string;
}

export interface CreateConversationRequest {
  participantId: string;
  participantName: string;
}

export interface CreateMessageRequest {
  conversationId: string;
  message: string;
  senderId: string;
  senderName: string;
}

export interface ConversationWithMessages extends Conversation {
  messages?: Message[];
}
