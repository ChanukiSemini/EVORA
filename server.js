require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const stationRoutes = require('./routes/stationRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' } });
});

app.use('/api/stations', stationRoutes);

// Must come after all routes
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Evora backend running on port ${PORT}`);
});

module.exports = app;
