// server.ts
import http from "http";
import { createWsServer } from "./wsServer";

const PORT = process.env.WS_PORT || 4000;

// Create a plain Node HTTP server
const server = http.createServer();

// Attach Socket.IO + Redis pub/sub to it
createWsServer(server);

// Start listening
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on http://localhost:${PORT}`);
});
