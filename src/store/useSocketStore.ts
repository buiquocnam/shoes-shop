import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8099';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  
  // Actions
  connect: (token: string) => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  connect: (token: string) => {
    // Prevent multiple connections
    if (get().socket?.connected) {
      console.log('🔌 [SocketStore] Already connected, skipping');
      return;
    }

    // If socket exists but disconnected, or token might have changed (though it's usually 1:1 with session)
    if (get().socket) {
      get().socket?.disconnect();
    }

    console.log('🔌 [SocketStore] Connecting to', SOCKET_URL);
    
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      query: { token } // Some backends prefer query params
    });

    socket.on('connect', () => {
      console.log('✅ [SocketStore] Connected', socket.id);
      set({ isConnected: true });
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ [SocketStore] Disconnected:', reason);
      set({ isConnected: false });
    });

    socket.on('connect_error', (error) => {
      console.error('⚠️ [SocketStore] Connection error:', error.message);
      set({ isConnected: false });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      console.log('🔌 [SocketStore] Manually disconnecting');
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));
