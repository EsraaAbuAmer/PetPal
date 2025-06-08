import express from "express";
import { protect } from "../middleware/authMiddleware";
import { db } from "../db";
import { ResultSetHeader } from "mysql2";
import { upload } from "../middleware/upload";
import { Console } from "console";

const router = express.Router();

type Pet = {
  id: number;
  name: string;
  breed: string;
  weight: number;
  type: string;
  birth_date: string;
  neutered: number;
  gender: string;
  image: string;
  updated_at: string;
};

// @desc    Add a new pet with image upload
// @route   POST /api/pets
// @access  Private
router.post("/", protect, upload.single("image"), async (req, res) => {
  const userId = req.user?.id;
  const imageFile = (req as any).file;
  const { name, breed, weight, type, birth_date, neutered, gender } = req.body;

  if (!name || !birth_date || !imageFile) {
    return res
      .status(400)
      .json({ message: "Please provide name, birth_date, and image file" });
  }

  try {
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      imageFile.filename
    }`;

    const [result] = (await db.execute(
      `INSERT INTO pets (user_id, name, breed, weight, type, birth_date, neutered, gender, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name,
        breed,
        weight,
        type,
        birth_date,
        neutered ? 1 : 0,
        gender,
        imageUrl,
      ]
    )) as [ResultSetHeader, unknown];

    res.status(201).json({
      message: "Pet added successfully",
      petId: result.insertId,
      imageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add pet" });
  }
});

// @desc    Get all pets for the user
// @route   GET /api/pets
// @access  Private
router.get("/", protect, async (req, res) => {
  const userId = req.user?.id;

  try {
    const [pets] = (await db.execute(
      `SELECT id, name, breed, weight, type, gender, neutered, birth_date, image
       FROM pets
       WHERE user_id = ?`,
      [userId]
    )) as [Omit<Pet, "updated_at">[], unknown];

    res.json(pets);
  } catch (error) {
    console.error("Fetch pets error:", error);
    res.status(500).json({ message: "Failed to fetch pets" });
  }
});

// @desc    Get a single pet
// @route   GET /api/pets/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  const petId = req.params.id;
  const userId = req.user?.id;

  try {
    const [rows] = (await db.execute(
      `SELECT id, name, breed, weight, type, gender, neutered, birth_date, image, updated_at
       FROM pets
       WHERE id = ? AND user_id = ?`,
      [petId, userId]
    )) as [Pet[], unknown];

    if (rows.length === 0) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Fetch pet error:", error);
    res.status(500).json({ message: "Failed to fetch pet" });
  }
});

// @desc    Update a pet
// @route   PATCH /api/pets/:id
// @access  Private
// @desc    Update a pet
// @route   PATCH /api/pets/:id
// @access  Private
router.patch('/:id', protect, upload.single('image'), async (req, res) => {
  const petId = req.params.id;
  const userId = req.user?.id;

  const {
    name,
    breed,
    weight,
    type,
    birth_date,
    neutered,
    gender,
    image_url, // Existing image url
  } = req.body;

  const imageFile = (req as any).file;

  console.log("imageFile", imageFile);
  console.log("image_url", image_url);

  try {
    // Start query
    let query = `UPDATE pets SET name = ?, breed = ?, weight = ?, type = ?, birth_date = ?, neutered = ?, gender = ?`;
    const params = [
      name,
      breed,
      weight,
      type,
      birth_date,
      neutered,
      gender,
    ];

    // Decide if we will update image:
    if (imageFile) {
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFile.filename}`;
      query += `, image = ?`;
      params.push(imageUrl);
    } 
    else if (image_url) {
      // Optional: update to same image_url
      query += `, image = ?`;
      params.push(image_url);
    } 
    // Else → do not touch image column

    // Finalize
    query += ` WHERE id = ? AND user_id = ?`;
    params.push(petId, userId);

    const [result] = await db.execute(query, params) as [ResultSetHeader, unknown];

    res.json({ message: 'Pet updated successfully' });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({ message: 'Failed to update pet' });
  }
});
router.post(
  "/upload-image",
  protect,
  upload.single("image"),
  async (req, res) => {
    const imageFile = (req as any).file;

    if (!imageFile) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      imageFile.filename
    }`;
    res.json({ imageUrl });
  }
);

export default router;
