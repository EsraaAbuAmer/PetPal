import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import petRoutes from './routes/pets';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/pets', petRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});