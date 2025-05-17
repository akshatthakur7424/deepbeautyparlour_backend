// importing packages
import express from "express" 
import dotenv from "dotenv"

// initializing packages
const app = express();
dotenv.config();

// global variables
const PORT = process.env.PORT || 7000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.get('/', (req, res) => {
  res.send('Hello, this is Deep Beauty Parlour server!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
