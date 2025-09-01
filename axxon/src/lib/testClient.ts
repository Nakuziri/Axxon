import { io } from "socket.io-client";

const BOARD_ID = "1"; // example boardId
const socket = io("http://localhost:4000"); // or your WS server URL

socket.on("connect", () => {
  console.log("Connected to WS server:", socket.id);

  // Join a board room
  socket.emit("joinBoard", BOARD_ID);
});

// Listen for board updates
socket.on("board:update", (data) => {
  console.log("Received board update:", data);
});
