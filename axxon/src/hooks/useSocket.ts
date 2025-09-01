import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

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
