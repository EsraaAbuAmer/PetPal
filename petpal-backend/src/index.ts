import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Use the router
app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 5002, () => {
  console.log('Server running on port 5002');
});