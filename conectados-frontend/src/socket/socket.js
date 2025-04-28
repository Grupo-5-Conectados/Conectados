import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // Cambiar si el backend tiene otro puerto

export default socket;
