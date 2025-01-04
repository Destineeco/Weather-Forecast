import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';  // Import the CORS package
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

// Enable CORS for all routes and origins (can be customized later)
app.use(cors());  // Allow all domains by default

// Optional: Restrict CORS to specific origins if needed
// app.use(cors({
//   origin: 'http://your-frontend-domain.com',  // Example: specify frontend domain
// }));

// TODO: Serve static files of entire client dist folder
app.use(express.static('../client/dist'));

// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
