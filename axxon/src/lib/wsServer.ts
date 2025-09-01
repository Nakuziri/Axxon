// wsServer.ts
import { Server } from "socket.io";
import http from "http";
import Redis from "ioredis";

// Create Redis clients (publisher and subscriber)
const pub = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const sub = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Initialize WebSocket server with Socket.IO
export function createWsServer(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Subscribe to all Redis channels
  sub.psubscribe("board:*", (err) => {
    if (err) console.error("Redis psubscribe error:", err);
    else console.log("Subscribed to Redis channels: board:*");
  });

  // On Redis publish, forward the message to the correct board room
  sub.on("pmessage", (pattern, channel, message) => {
    console.log("Redis pmessage received:", { pattern, channel, message });

    try {
      const [, boardId] = channel.split(":"); // channel = board:<boardId>
      console.log(`Broadcasting message to board room ${boardId}`);
      io.to(boardId).emit("board:update", JSON.parse(message));
    } catch (err) {
      console.error("Failed to forward Redis message:", err);
    }
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    let currentBoard: string | null = null;

    // Join a board room (only if different from current)
    socket.on("joinBoard", (boardId: string) => {
      if (currentBoard === boardId) {
        // Already in the desired room, no action
        console.log(`Socket ${socket.id} already in board ${boardId}`);
        return;
      }

      if (currentBoard) {
        socket.leave(currentBoard);
        console.log(`Socket ${socket.id} left previous board ${currentBoard}`);
      }

      socket.join(boardId);
      currentBoard = boardId;
      console.log(`Socket ${socket.id} joined board ${boardId}`);
    });

    // Leave current board explicitly
    socket.on("leaveBoard", () => {
      if (currentBoard) {
        socket.leave(currentBoard);
        console.log(`Socket ${socket.id} left board ${currentBoard}`);
        currentBoard = null;
      }
    });

    // Handle disconnects
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

// Helper to publish events into Redis for cross-instance broadcast
export async function publishBoardUpdate(boardId: string, payload: any) {
  console.log(`Publishing update to Redis board:${boardId}`, payload);
  await pub.publish(`board:${boardId}`, JSON.stringify(payload));
}
