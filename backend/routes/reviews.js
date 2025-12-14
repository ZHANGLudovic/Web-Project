const express = require('express');
const router = express.Router();
const db = require('../database');
const { validateRating } = require('../middleware/validation');

// GET all reviews for a field
router.get('/field/:fieldId', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  db.all(
    `SELECT r.*, u.username 
     FROM reviews r 
     JOIN users u ON r.user_id = u.id 
     WHERE r.field_id = ? 
     ORDER BY r.created_at DESC 
     LIMIT ? OFFSET ?`,
    [req.params.fieldId, parseInt(limit), offset],
    (err, reviews) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Get total count
      db.get(
        'SELECT COUNT(*) as count FROM reviews WHERE field_id = ?',
        [req.params.fieldId],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          res.json({
            data: reviews || [],
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              total: result.count,
              pages: Math.ceil(result.count / limit)
            }
          });
        }
      );
    }
  );
});

// GET user review for a field
router.get('/field/:fieldId/user/:userId', (req, res) => {
  db.get(
    'SELECT * FROM reviews WHERE field_id = ? AND user_id = ?',
    [req.params.fieldId, req.params.userId],
    (err, review) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(review || null);
    }
  );
});

// CREATE a review
router.post('/', (req, res) => {
  const { field_id, user_id, rating, comment } = req.body;

  if (!field_id || !user_id || !rating) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!validateRating(rating)) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  // Check if user already reviewed this field
  db.get(
    'SELECT id FROM reviews WHERE field_id = ? AND user_id = ?',
    [field_id, user_id],
    (err, existing) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (existing) {
        return res.status(400).json({ error: 'You have already reviewed this field' });
      }

      db.run(
        'INSERT INTO reviews (field_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        [field_id, user_id, rating, comment || null],
        function (err) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          // Update field average rating
          db.get(
            'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE field_id = ?',
            [field_id],
            (err, stats) => {
              if (err) {
                return res.status(500).json({ error: 'Database error' });
              }

              db.run(
                'UPDATE fields SET rating = ?, review_count = ? WHERE id = ?',
                [stats.avg_rating || 0, stats.review_count || 0, field_id],
                (err) => {
                  if (err) {
                    return res.status(500).json({ error: 'Failed to update field rating' });
                  }

                  res.json({
                    message: 'Review created successfully',
                    id: this.lastID
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

// UPDATE a review
router.put('/:id', (req, res) => {
  const { rating, comment, user_id, field_id } = req.body;

  if (!rating && !comment) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  if (rating && !validateRating(rating)) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  let query = 'UPDATE reviews SET';
  let params = [];

  if (rating) {
    query += ' rating = ?';
    params.push(rating);
  }
  if (comment !== undefined) {
    if (params.length > 0) query += ',';
    query += ' comment = ?';
    params.push(comment);
  }

  query += ', updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  params.push(req.params.id);

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Update field average rating
    if (field_id) {
      db.get(
        'SELECT AVG(rating) as avg_rating FROM reviews WHERE field_id = ?',
        [field_id],
        (err, stats) => {
          if (!err) {
            db.run(
              'UPDATE fields SET rating = ? WHERE id = ?',
              [stats.avg_rating || 0, field_id],
              (err) => {
                res.json({ message: 'Review updated successfully' });
              }
            );
          } else {
            res.json({ message: 'Review updated successfully' });
          }
        }
      );
    } else {
      res.json({ message: 'Review updated successfully' });
    }
  });
});

// DELETE a review
router.delete('/:id', (req, res) => {
  db.get('SELECT field_id FROM reviews WHERE id = ?', [req.params.id], (err, review) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    db.run('DELETE FROM reviews WHERE id = ?', [req.params.id], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Update field average rating
      db.get(
        'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE field_id = ?',
        [review.field_id],
        (err, stats) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          db.run(
            'UPDATE fields SET rating = ?, review_count = ? WHERE id = ?',
            [stats.avg_rating || 0, stats.review_count || 0, review.field_id],
            (err) => {
              if (err) {
                return res.status(500).json({ error: 'Failed to update field rating' });
              }
              res.json({ message: 'Review deleted successfully' });
            }
          );
        }
      );
    });
  });
});

module.exports = router;
