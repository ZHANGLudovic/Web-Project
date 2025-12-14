const express = require('express');
const router = express.Router();
const db = require('../database');
const { validateRating } = require('../middleware/validation');

// GET user profile by ID
router.get('/:id', (req, res) => {
  const userId = req.params.id;

  db.get(
    'SELECT id, email, username, role, created_at FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    }
  );
});

// UPDATE user profile
router.put('/:id', (req, res) => {
  const { username, email } = req.body;
  const userId = req.params.id;

  if (!username && !email) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  let query = 'UPDATE users SET';
  let params = [];

  if (username) {
    query += ' username = ?';
    params.push(username);
  }
  if (email) {
    if (username) query += ',';
    query += ' email = ?';
    params.push(email);
  }

  query += ' WHERE id = ?';
  params.push(userId);

  db.run(query, params, function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Username or email already taken' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'Profile updated successfully' });
  });
});

// GET user reservations
router.get('/:id/reservations', (req, res) => {
  const userId = req.params.id;
  const { status, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = `SELECT r.*, f.name, f.sport, f.city, f.address, f.image_url
               FROM reservations r
               JOIN fields f ON r.field_id = f.id
               WHERE r.user_id = ?`;
  let params = [userId];

  if (status) {
    query += ' AND r.status = ?';
    params.push(status);
  }

  query += ' ORDER BY r.reservation_date DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows || []);
  });
});

// CREATE a reservation
router.post('/:id/reservations', (req, res) => {
  const userId = req.params.id;
  const { field_id, reservation_date, start_time, end_time, total_price, notes } = req.body;

  if (!field_id || !reservation_date || !start_time || !end_time || !total_price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate time format
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
    return res.status(400).json({ error: 'Invalid time format (use HH:mm)' });
  }

  // Check for time conflicts
  db.get(
    `SELECT id FROM reservations 
     WHERE field_id = ? AND reservation_date = ? 
     AND status != 'cancelled'
     AND (
       (start_time < ? AND end_time > ?) OR
       (start_time < ? AND end_time > ?) OR
       (start_time >= ? AND end_time <= ?)
     )`,
    [field_id, reservation_date, end_time, start_time, end_time, start_time, start_time, end_time],
    (err, conflict) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (conflict) {
        return res.status(409).json({ error: 'Field is not available at this time' });
      }

      db.run(
        `INSERT INTO reservations (user_id, field_id, reservation_date, start_time, end_time, total_price, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, field_id, reservation_date, start_time, end_time, total_price, notes || null],
        function (err) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({
            message: 'Reservation created successfully',
            id: this.lastID
          });
        }
      );
    }
  );
});

// UPDATE a reservation
router.put('/:id/reservations/:reservationId', (req, res) => {
  const { id: userId, reservationId } = req.params;
  const { reservation_date, start_time, end_time, status, notes } = req.body;

  let query = 'UPDATE reservations SET';
  let params = [];

  if (reservation_date) {
    query += ' reservation_date = ?';
    params.push(reservation_date);
  }
  if (start_time) {
    if (params.length > 0) query += ',';
    query += ' start_time = ?';
    params.push(start_time);
  }
  if (end_time) {
    if (params.length > 0) query += ',';
    query += ' end_time = ?';
    params.push(end_time);
  }
  if (status) {
    if (params.length > 0) query += ',';
    query += ' status = ?';
    params.push(status);
  }
  if (notes !== undefined) {
    if (params.length > 0) query += ',';
    query += ' notes = ?';
    params.push(notes);
  }

  if (params.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  query += ', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?';
  params.push(reservationId, userId);

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ message: 'Reservation updated successfully' });
  });
});

// CANCEL a reservation
router.delete('/:id/reservations/:reservationId', (req, res) => {
  const { id: userId, reservationId } = req.params;

  db.run(
    'UPDATE reservations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
    ['cancelled', reservationId, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Reservation not found' });
      }
      res.json({ message: 'Reservation cancelled successfully' });
    }
  );
});

module.exports = router;
