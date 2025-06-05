import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { db } from '../db';
import { ResultSetHeader } from 'mysql2';
import { upload } from '../middleware/upload'; // <-- multer middleware
import path from 'path';
import { log } from 'console';

const router = express.Router();

// @desc    Add a new pet with image upload
// @route   POST /api/pets
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  const { name, age } = req.body;
  const userId = req.user?.id;
  const imageFile = (req as any).file;

  if (!name || !age || !imageFile) {
    return res.status(400).json({ message: 'Please provide name, age, and image file' });
  }

  try {
    // Construct the accessible image URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFile.filename}`;

    const [result] = await db.execute(
      'INSERT INTO pets (user_id, name, age, image) VALUES (?, ?, ?, ?)',
      [userId, name, age, imageUrl]
    ) as [ResultSetHeader, unknown];

    res.status(201).json({
      message: 'Pet added successfully',
      petId: result.insertId,
      imageUrl,
    });
  } catch (error) {
    console.error('Add pet error:', error);
    res.status(500).json({ message: 'Failed to add pet' });
  }
});
router.get('/', protect, async (req, res) => {
  const userId = req.user?.id;

  try {
    const [pets] = await db.execute(
      'SELECT id, name, age, image FROM pets WHERE user_id = ?',
      [userId]
    );
    console.log("in BE ddd",pets)
    res.json(pets);
  } catch (error) {
    console.error('Fetch pets error:', error);
    res.status(500).json({ message: 'Failed to fetch pets' });
  }
});

export default router;