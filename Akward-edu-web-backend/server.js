import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './utils/mongodb.js';

import userRoutes from './routes/userRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import levelRoutes from './routes/levelRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import userStoryProgressRoutes from './routes/userStoryProgressRoutes.js';
import newsStoryRoutes from './routes/newsStoryRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB().catch(console.error);

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

//Routes
app.use('/api/users', userRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/progress', userStoryProgressRoutes);
app.use('/api/news-stories', newsStoryRoutes);


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
