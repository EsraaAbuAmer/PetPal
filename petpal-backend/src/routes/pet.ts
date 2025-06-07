import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { db } from '../db';
import { ResultSetHeader } from 'mysql2';
import { upload } from '../middleware/upload';

const router = express.Router();

// Define the Pet type here (or import from types.ts)
type Pet = {
  id: number;
  name: string;
  birth_date: string;
  image: string;
  updated_at: string;
};

// @desc    Add a new pet with image upload
// @route   POST /api/pets
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  const { name, birth_date } = req.body;
  const userId = req.user?.id;
  const imageFile = (req as any).file;

  if (!name || !birth_date || !imageFile) {
    return res.status(400).json({ message: 'Please provide name, birth_date, and image file' });
  }

  try {
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFile.filename}`;

    const [result] = await db.execute(
      'INSERT INTO pets (user_id, name, birth_date, image) VALUES (?, ?, ?, ?)',
      [userId, name, birth_date, imageUrl]
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

// @desc    Get all pets for the user
// @route   GET /api/pets
// @access  Private
router.get('/', protect, async (req, res) => {
  const userId = req.user?.id;

  try {
    const [pets] = await db.execute(
      'SELECT id, name, birth_date, image FROM pets WHERE user_id = ?',
      [userId]
    ) as [Omit<Pet, 'updated_at'>[], unknown];

    res.json(pets);
  } catch (error) {
    console.error('Fetch pets error:', error);
    res.status(500).json({ message: 'Failed to fetch pets' });
  }
});

// @desc    Get a single pet
// @route   GET /api/pets/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  const petId = req.params.id;
  const userId = req.user?.id;

  try {
    const [rows] = await db.execute(
      'SELECT id, name, birth_date, image, updated_at FROM pets WHERE id = ? AND user_id = ?',
      [petId, userId]
    ) as [Pet[], unknown];

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch pet error:', error);
    res.status(500).json({ message: 'Failed to fetch pet' });
  }
});

// @desc    Update a pet
// @route   PATCH /api/pets/:id
// @access  Private
router.patch('/:id', protect, async (req, res) => {
  const petId = req.params.id;
  const userId = req.user?.id;
  const { name, birth_date, image } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE pets SET name = ?, birth_date = ?, image = ? WHERE id = ? AND user_id = ?`,
      [name, birth_date, image, petId, userId]
    ) as [ResultSetHeader, unknown];

    res.json({ message: 'Pet updated successfully' });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({ message: 'Failed to update pet' });
  }
});



export default router;