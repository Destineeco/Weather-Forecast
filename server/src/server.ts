import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS (Allowing frontend access)
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://weather-forecast11.onrender.com' // Production frontend URL
    : 'http://localhost:3000',  // Local frontend URL
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import routes from './routes/index.js';
app.use(routes);

// Serve static files (for production)
app.use(express.static('../client/dist'));

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
