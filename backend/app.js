import express from "express";
import dotenv from "dotenv";

// Load environment variables from the .env file in the config directory
dotenv.config({ path: './config/.env' });

const app = express();

app.get('/', (req, res) => {
  res.send("Hello, MERN stack!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});