import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

const app = express();

connectDB();

app.use(
  cors()
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('EVORA backend is running');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' } });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Evora backend running on port ${PORT}`);
});

