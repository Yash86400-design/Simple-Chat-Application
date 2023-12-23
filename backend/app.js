import express from "express";
import dotenv from "dotenv";
import { createServer } from 'node:http';
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

// Load environment variables from the .env file in the config directory
dotenv.config({ path: './config/.env' });

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// CORS issue handle
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send({ message: 'Initial Route' });
});

app.get('/api/data', (req, res) => {
  res.send({ message: "Hello, MERN stack!" });
});

io.on('connection', (socket) => {
  const userId = uuidv4();
  console.log('a user connected', userId);
  socket.emit('userId', userId);

  socket.on('message-sent', ({ room, content }) => {
    console.log(selectedChat, message);
    console.log(`Received message from ${userId}: ${content} inside chatroom: ${room}`);
    io.emit('message', { userId, message: data });
  });

  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});