import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import bookRoutes from './routes/books.js';
import memberRoutes from './routes/members.js';
import issueRoutes from './routes/issues.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/issues', issueRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Library Management API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
