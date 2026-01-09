import { create } from 'zustand';

interface ChatState {
  activeConversationId: string | null;
  typingUsers: Record<string, boolean>; // userId -> isTyping
  
  // Actions
  setActiveConversation: (id: string | null) => void;
  setTyping: (userId: string, isTyping: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversationId: null,
  typingUsers: {},

  setActiveConversation: (id) => set({ activeConversationId: id }),
  
  setTyping: (userId, isTyping) => 
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [userId]: isTyping
      }
    })),

  clearChat: () => set({ 
    activeConversationId: null,
    typingUsers: {}
  }),
}));
