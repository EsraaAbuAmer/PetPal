// src/routes/pets.ts
import express from 'express';
import { db } from '../db';
const router = express.Router();

router.get('/', async (req, res) => {
  const [pets] = await db.query('SELECT * FROM pets');
  res.json(pets);
});

export default router;