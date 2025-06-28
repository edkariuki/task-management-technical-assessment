import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './utils/db';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (_, res) => {
  res.send('Task Mgt API is running!');
});

app.listen(PORT, async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Connected');
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.error('Error connecting:', err);
  }
});
