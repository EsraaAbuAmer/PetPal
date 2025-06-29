import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import petRoutes from './routes/pet';
import vaccinationRoutes from './routes/vaccinations';
import eventRoutes from './routes/events';



dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', vaccinationRoutes);
app.use('/api', eventRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(process.env.PORT || 5002, () => {
  console.log('Server running on port 5002');
});