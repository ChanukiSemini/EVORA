// server.js
// Entry point for the backend. Loads environment variables,
// connects to the database, sets up Express, and starts the server.

import 'dotenv/config';       // loads variables from .env into process.env
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// Routes
import reviewRoutes from './routes/reviewRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import driverRoutes from './routes/driverRoutes.js';

// Connect to MongoDB before starting the server
connectDB();

const app = express();

app.use(cors());          // allows the frontend to call this API from a different port
app.use(express.json());  // parses incoming JSON request bodies

// Simple test route to confirm the server is running
app.get('/', (req, res) => {
    res.send('EVORA backend is running');
});

// API Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/drivers', driverRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));