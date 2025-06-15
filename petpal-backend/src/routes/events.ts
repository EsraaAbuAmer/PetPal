import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { db } from '../db';
import { ResultSetHeader } from 'mysql2'; // ADD THIS

const router = express.Router({ mergeParams: true });

// GET /api/pets/:id/events
router.get('/pets/:id/events', protect, async (req, res) => {
  const petId = req.params.id;
  const userId = req.user?.id;

  try {
    const [events] = await db.execute(
      `SELECT e.id, e.event_title, e.event_date, e.notes, e.created_at
       FROM events e
       JOIN pets p ON e.pet_id = p.id
       WHERE p.id = ? AND p.user_id = ?`,
      [petId, userId]
    );

    res.json(events);
  } catch (error) {
    console.error('Fetch events error:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// POST /api/pets/:id/events
router.post('/pets/:id/events', protect, async (req, res) => {
  const petId = req.params.id;
  const userId = req.user?.id;
  const { event_title, event_date, notes } = req.body;

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
      `INSERT INTO events (pet_id, event_title, event_date, notes)
       VALUES (?, ?, ?, ?)`,
      [petId, event_title, event_date, notes]
    ) as [ResultSetHeader, unknown]; // CAPTURE result

    res.status(201).json({
      message: 'Event added successfully',
      event: {
        id: result.insertId,
        event_title,
        event_date,
        notes
      }
    });
  } catch (error) {
    console.error('Add event error:', error);
    res.status(500).json({ message: 'Failed to add event' });
  }
});


router.get("/events/upcoming", protect, async (req, res) => {
  const userId = req.user?.id;

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        e.id AS eventId,
        e.event_title AS type,
        e.event_date AS date,
        p.id AS petId,
        p.name AS petName,
        p.image AS petImage
      FROM events e
      JOIN pets p ON e.pet_id = p.id
      WHERE p.user_id = ?
        AND e.event_date >= CURDATE()
      ORDER BY e.event_date ASC
      LIMIT 10
      `,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch upcoming events:", error);
    res.status(500).json({ message: "Failed to fetch upcoming events" });
  }
});

export default router;