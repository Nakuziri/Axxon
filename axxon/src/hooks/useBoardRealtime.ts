// hooks/useBoardRealtime.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";
import type { RefObject } from "react";

export function useBoardRealtime(boardId: string, socketRef: RefObject<Socket | null>) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    let currentBoard = boardId;

    // --- Event handlers ---
    const handleTodoCreated = (todo: any) => {
      console.log("Realtime todo created received:", todo);
      queryClient.setQueryData(["todos", currentBoard], (old: any[]) =>
        old ? [...old, todo] : [todo]
      );
    };

    const handleTodoUpdated = (todo: any) => {
      console.log("Realtime todo updated received:", todo);
      queryClient.setQueryData(["todos", currentBoard], (old: any[]) =>
        old ? old.map(t => (t.id === todo.id ? todo : t)) : [todo]
      );
    };

    const handleTodoDeleted = ({ id }: any) => {
      console.log("Realtime todo deleted received:", id);
      queryClient.setQueryData(["todos", currentBoard], (old: any[]) =>
        old ? old.filter(t => t.id !== id) : []
      );
    };

    // --- Listen for all board events ---
    socket.on("board:todo:created", handleTodoCreated);
    socket.on("board:todo:updated", handleTodoUpdated);
    socket.on("board:todo:deleted", handleTodoDeleted);

    // --- Join the board ---
    socket.emit("joinBoard", boardId);

    // --- Handle boardId changes (switching boards) ---
    const prevBoard = currentBoard;
    currentBoard = boardId;
    if (prevBoard !== currentBoard) {
      socket.emit("leaveBoard", prevBoard);
      socket.emit("joinBoard", currentBoard);
    }

    // --- Cleanup ---
    return () => {
      socket.off("board:todo:created", handleTodoCreated);
      socket.off("board:todo:updated", handleTodoUpdated);
      socket.off("board:todo:deleted", handleTodoDeleted);
      socket.emit("leaveBoard", currentBoard);
    };
  }, [boardId, queryClient, socketRef]);
}
