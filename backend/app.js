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

io.on('connection', (socket) => {
  const randomUserName = generateRandomName();
  const userId = uuidv4();
  console.log('a user connected', userId, randomUserName);
  socket.emit('userId', randomUserName);

  // Joining rooms
  socket.on('joinRoom', ({ roomName }) => {
    socket.join(roomName);
    console.log(`User: ${randomUserName} Joined room: ${roomName}`);
  });
  // socket.join('general-room');
  // socket.join('tech-room');
  // socket.join('random-room');

  socket.on('general-room', ({ room, content }) => {
    // io.emit('message-received-sent-back-again', { userId, message: content });
    io.to(room).emit('general-room-messages', { userId: randomUserName, message: content });
  });

  socket.on('tech-room', ({ room, content }) => {
    io.to(room).emit('tech-room-messages', { userId: randomUserName, message: content });
  });

  socket.on('random-room', ({ room, content }) => {
    io.to(room).emit('random-room-messages', { userId: randomUserName, message: content });
  });

  socket.on('disconnect', () => {
    console.log(`User ${randomUserName} disconnected`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});