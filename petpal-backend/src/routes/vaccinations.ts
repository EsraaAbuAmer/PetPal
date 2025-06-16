import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { db } from '../db';
import { ResultSetHeader } from 'mysql2'; // ADD THIS!

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

    const [result] = await db.execute(
      `INSERT INTO vaccinations (pet_id, vaccine_name, date_administered, notes)
       VALUES (?, ?, ?, ?)`,
      [petId, vaccine_name, date_administered, notes]
    ) as [ResultSetHeader, unknown];  // CAPTURE INSERT RESULT!

    res.status(201).json({
      message: 'Vaccination added successfully',
      vaccination: {
        id: result.insertId,
        vaccine_name,
        date_administered,
        notes
      }
    });
  } catch (error) {
    console.error('Add vaccination error:', error);
    res.status(500).json({ message: 'Failed to add vaccination' });
  }
});

// PATCH /api/vaccinations/:vaccinationId
router.patch('/vaccinations/:vaccinationId', protect, async (req, res) => {
  const { vaccinationId } = req.params;
  const userId = req.user?.id;
  const { vaccine_name, date_administered, notes } = req.body;

  try {
    // Confirm vaccination belongs to a pet owned by the user
    const [rows] = await db.execute(
      `SELECT v.id FROM vaccinations v
       JOIN pets p ON v.pet_id = p.id
       WHERE v.id = ? AND p.user_id = ?`,
      [vaccinationId, userId]
    );

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ message: 'Vaccination not found or unauthorized' });
    }

    await db.execute(
      `UPDATE vaccinations
       SET vaccine_name = ?, date_administered = ?, notes = ?
       WHERE id = ?`,
      [vaccine_name, date_administered, notes, vaccinationId]
    );

    res.json({ message: 'Vaccination updated successfully' });
  } catch (error) {
    console.error('Update vaccination error:', error);
    res.status(500).json({ message: 'Failed to update vaccination' });
  }
});

// DELETE /api/vaccinations/:vaccinationId
router.delete('/vaccinations/:vaccinationId', protect, async (req, res) => {
  const { vaccinationId } = req.params;
  const userId = req.user?.id;

  try {
    // Confirm ownership
    const [rows] = await db.execute(
      `SELECT v.id FROM vaccinations v
       JOIN pets p ON v.pet_id = p.id
       WHERE v.id = ? AND p.user_id = ?`,
      [vaccinationId, userId]
    );

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ message: 'Vaccination not found or unauthorized' });
    }

    await db.execute(`DELETE FROM vaccinations WHERE id = ?`, [vaccinationId]);

    res.json({ message: 'Vaccination deleted successfully' });
  } catch (error) {
    console.error('Delete vaccination error:', error);
    res.status(500).json({ message: 'Failed to delete vaccination' });
  }
});




export default router;