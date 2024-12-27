import { Conversation } from '@prisma/client';
import { create } from 'zustand';

interface ConversationsState {
  conversations: Conversation[];
  isLoading: boolean;
  activeId: string | null;
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (id: string) => void;
  setActiveId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useConversationsStore = create<ConversationsState>((set: any) => ({
  conversations: [],
  isLoading: true,
  activeId: null,
  setConversations: (conversations: Conversation[]) =>
    set((state: ConversationsState) => ({
      ...state,
      conversations,
      isLoading: false,
    })),
  addConversation: (conversation: Conversation) =>
    set((state: ConversationsState) => ({
      ...state,
      conversations: [conversation, ...state.conversations],
    })),
  removeConversation: (id: string) =>
    set((state: ConversationsState) => ({
      ...state,
      conversations: state.conversations.filter(
        (c: Conversation) => c.id !== id,
      ),
    })),
  setActiveId: (id: string | null) =>
    set((state: ConversationsState) => ({
      ...state,
      activeId: id,
    })),
  setLoading: (loading: boolean) =>
    set((state: ConversationsState) => ({
      ...state,
      isLoading: loading,
    })),
}));
