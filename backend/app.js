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

  // Joining rooms
  socket.on('joinRoom', ({ roomName }) => {
    socket.join(roomName);
    console.log(`User: ${userId} Joined room: ${roomName}`);
  });
  // socket.join('general-room');
  // socket.join('tech-room');
  // socket.join('random-room');

  socket.on('general-room', ({ room, content }) => {
    // io.emit('message-received-sent-back-again', { userId, message: content });
    console.log(content, room, userId);
    io.to('General').emit('general-room-messages',{ userId, message: content });
  });

  socket.on('tech-room', ({ room, content }) => {
    console.log(content, room, userId);
    io.to('Tech Talk').emit('tech-room-messages', { userId, message: content });
  });

  socket.on('random-room', ({ room, content }) => {
    console.log(content, room, userId);
    io.to('Random').emit('random-room-messages', { userId, message: content });
  });

  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});