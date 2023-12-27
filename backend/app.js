import express from "express";
import dotenv from "dotenv";
import { createServer } from 'node:http';
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import sqlite3 from "sqlite3";
import { open } from 'sqlite';

// Load environment variables from the .env file in the config directory
dotenv.config({ path: './config/.env' });

// open the database file
const db = await open({
  filename: 'chat.db',
  driver: sqlite3.Database
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS general_room_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_offset TEXT UNIQUE,
    content TEXT
    name TEXT
  );
  CREATE TABLE IF NOT EXISTS tech_room_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_offset TEXT UNIQUE,
    content TEXT
    name TEXT
  );
  CREATE TABLE IF NOT EXISTS random_room_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_offset TEXT UNIQUE,
    content TEXT
    name TEXT
  );
`);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
  connectionStateRecovery: {}
});

// Random name generators
const firstNames = [
  'Aarav', 'Aanya', 'Aaradhya', 'Abhinav', 'Aditi', 'Advait', 'Aisha', 'Akshay', 'Amrita', 'Ananya',
  'Aniket', 'Anika', 'Anirudh', 'Anjali', 'Arjun', 'Arya', 'Ashwin', 'Avni', 'Ayush', 'Chetan',
  'Dhruv', 'Divya', 'Esha', 'Gaurav', 'Gayatri', 'Harsh', 'Ishaan', 'Jiya', 'Kabir', 'Kavya',
  'Krishna', 'Lavanya', 'Mahesh', 'Meera', 'Mohit', 'Neha', 'Nikhil', 'Nina', 'Nitin', 'Pooja',
  'Pranav', 'Priya', 'Rahul', 'Riya', 'Rohit', 'Saachi', 'Sahil', 'Sanvi', 'Shreya', 'Siddharth',
  'Simran', 'Sneha', 'Suman', 'Tanvi', 'Uday', 'Vaishnavi', 'Varun', 'Vidya', 'Vikram', 'Yash',
  'Zoya', 'Arnav', 'Ishita', 'Rehaan', 'Ritika', 'Kunal', 'Ishani', 'Surya', 'Jasmine', 'Rajat',
  'Anvi', 'Nandini', 'Ansh', 'Aditya', 'Aryana', 'Ishan', 'Akshara', 'Aryan', 'Vivaan', 'Khushi',
  'Aryaman', 'Riyaan', 'Advika', 'Aarush', 'Sara', 'Vihaan', 'Advay', 'Viha', 'Prisha', 'Aaditya'
];
const lastNames = [
  'Sharma', 'Verma', 'Singh', 'Patel', 'Das', 'Jha', 'Yadav', 'Bose', 'Reddy', 'Chatterjee',
  'Kumar', 'Chauhan', 'Gupta', 'Pillai', 'Iyer', 'Mukherjee', 'Nair', 'Rao', 'Mehta', 'Malhotra',
  'Lal', 'Rastogi', 'Mishra', 'Jain', 'Agarwal', 'Goswami', 'Sinha', 'Raj', 'Ahuja', 'Banerjee',
  'Pandey', 'Dutta', 'Srivastava', 'Ganguly', 'Trivedi', 'Kulkarni', 'Menon', 'Sethi', 'Saxena',
  'Bhat', 'Nayak', 'Chopra', 'Deshmukh', 'Hegde', 'Pawar', 'Biswas', 'Rawat', 'Thakur', 'Joshi',
  'Tiwari', 'Khan', 'Choudhury', 'Yadav', 'Dube', 'Puri', 'Sen', 'Banerji', 'Ranganathan', 'Venkatesh',
  'Choudhary', 'Rajput', 'Mistry', 'Kapoor', 'Deshpande', 'Kamble', 'Narayan', 'Rangan', 'Nagpal',
  'Rai', 'Saini', 'Bajaj', 'Tandon', 'Bhatia', 'Sarin', 'Kohli', 'Dhillon', 'Talwar', 'Seth', 'Mittal',
  'Kher', 'Khanna', 'Datta', 'Nath', 'Kapoor', 'Rathi', 'Anand', 'Bakshi', 'Varma', 'Sabharwal',
  'Mathur', 'Chauhan', 'Dubey', 'Arora', 'Bhatt', 'Sisodia', 'Shukla', 'Soni', 'Sundaram', 'Raghavan'
];

function generateRandomName() {
  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${randomFirstName} ${randomLastName}`;
}

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

io.on('connection', async (socket) => {
  const randomUserName = generateRandomName();
  const userId = uuidv4();
  console.log('a user connected', userId, randomUserName);
  socket.emit('userId', randomUserName);

  // Joining rooms
  socket.on('joinRoom', ({ roomName }) => {
    socket.join(roomName);
    console.log(`User: ${randomUserName} Joined room: ${roomName}`);
  });

  socket.on('general-room', async ({ room, content }) => {
    let result;
    try {
      // store the message in corresponding database
      result = await db.run('INSERT INTO general_room_messages (content) VALUES (?)', content);
    } catch (error) {
      console.log(error);
    }
    io.to(room).emit('general-room-messages', { userId: randomUserName, message: content }, result.lastID);
  });

  socket.on('tech-room', async ({ room, content }) => {
    let result;
    try {
      result = await db.run('INSERT INTO tech_room_messages (content) VALUES (?)', content);
    } catch (error) {
      console.log(error);
    }
    io.to(room).emit('tech-room-messages', { userId: randomUserName, message: content }, result.lastID);
  });

  socket.on('random-room', async ({ room, content }) => {
    let result;
    try {
      result = await db.run('INSERT INTO random_room_messages (content) VALUES (?)', content);
    } catch (error) {
      console.log(error);
    }
    io.to(room).emit('random-room-messages', { userId: randomUserName, message: content }, result.lastID);
  });

  if (!socket.recovered) {
    // If the connection state recovery was not successful
    const rooms = Object.keys(socket.rooms); // Get all rooms the user is in
    rooms.forEach(async (room) => {
      const lastMessageId = socket.handshake.auth[`${room}LastMessageId`] || 0;
      try {
        // Fetch messages from the database starting from the lastMessageId
        const messages = await db.all(`SELECT id, content, name FROM ${room}_messages WHERE id > ?`, lastMessageId);
        messages.forEach((message) => {
          socket.to(room).emit('room-messages', { userId: message.name, message: message.content, messageId: message.id });
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  socket.on('disconnect', () => {
    console.log(`User ${randomUserName} disconnected`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});