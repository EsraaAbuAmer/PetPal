import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { db } from '../db';

const router = express.Router({ mergeParams: true });

// GET /api/pets/:id/vaccinations
router.get('/pets/:id/vaccinations', protect, async (req, res) => {
  const petId = req.params.id;
  const userId = req.user?.id;

  try {
    const [vaccinations] = await db.execute(
      `SELECT v.id, v.vaccine_name, v.date_administered, v.notes, v.created_at
       FROM vaccinations v
       JOIN pets p ON v.pet_id = p.id
       WHERE p.id = ? AND p.user_id = ?`,
      [petId, userId]
    );

    res.json(vaccinations);
  } catch (error) {
    console.error('Fetch vaccinations error:', error);
    res.status(500).json({ message: 'Failed to fetch vaccinations' });
  }
});

// POST /api/pets/:id/vaccinations
router.post('/pets/:id/vaccinations', protect, async (req, res) => {
  const petId = req.params.id;
  const userId = req.user?.id;
  const { vaccine_name, date_administered, notes } = req.body;

  try {
    // Check pet ownership
    const [petRows] = await db.execute(
      `SELECT id FROM pets WHERE id = ? AND user_id = ?`,
      [petId, userId]
    );

    if ((petRows as any[]).length === 0) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    await db.execute(
      `INSERT INTO vaccinations (pet_id, vaccine_name, date_administered, notes)
       VALUES (?, ?, ?, ?)`,
      [petId, vaccine_name, date_administered, notes]
    );

    res.status(201).json({ message: 'Vaccination added successfully' });
  } catch (error) {
    console.error('Add vaccination error:', error);
    res.status(500).json({ message: 'Failed to add vaccination' });
  }
});

export default router;