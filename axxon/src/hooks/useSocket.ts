import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

/**
 * Manages a single Socket.IO websocket connection and joins/leaves a board room.
 *
 * Creates (once) a Socket.IO client connected to the URL from `NEXT_PUBLIC_WS_URL` (defaults to `http://localhost:4000`)
 * using the websocket transport, and keeps it in a ref for component access. When `boardId` changes the hook will
 * emit `leaveBoard` for the previously joined board (if any) and `joinBoard` for the new `boardId`. The socket is
 * disconnected and internal refs are cleared on unmount.
 *
 * @param boardId - The ID of the board room to join; when changed the hook will switch rooms accordingly.
 * @returns A ref containing the Socket instance or `null` while not connected.
 */
export function useSocket(boardId: string) {
  const socketRef = useRef<Socket | null>(null);
  const currentBoardRef = useRef<string | null>(null);

  // Create socket once
  useEffect(() => {
    if (!socketRef.current) {
      const socket = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:4000", {
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log(`Socket connected: ${socket.id}`);
      });

      socketRef.current = socket;
    }

    return () => {
      // Disconnect only on unmount
      socketRef.current?.disconnect();
      socketRef.current = null;
      currentBoardRef.current = null;
    };
  }, []);

  // Join / leave rooms when boardId changes
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    if (currentBoardRef.current === boardId) return;

    if (currentBoardRef.current) {
      socket.emit("leaveBoard", currentBoardRef.current);
      console.log(`Left board ${currentBoardRef.current}`);
    }
    
    socket.emit("joinBoard", boardId);
    console.log(`Joined board ${boardId}`);
    
    currentBoardRef.current = boardId;
  }, [boardId]);

  return socketRef;
}
