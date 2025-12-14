const express = require('express');
const router = express.Router();
const db = require('../database');
const { validateFieldName, validatePrice } = require('../middleware/validation');

// GET all fields with pagination and filtering
router.get('/', (req, res) => {
  const { sport, ville, page = 1, limit = 12, search } = req.query;
  const offset = (page - 1) * limit;
  
  let query = 'SELECT * FROM fields';
  let params = [];
  
  if (sport) {
    query += ' AND sport = ?';
    params.push(sport);
  }
  
  if (ville) {
    query += ' AND ville = ?';
    params.push(ville);
  }
  
  if (search) {
    query += ' AND (nom LIKE ? OR description LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }
  
  query += ' ORDER BY rating DESC, created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as count FROM fields';
    let countParams = [];
    
    if (sport) {
      countQuery += ' AND sport = ?';
      countParams.push(sport);
    }
    if (ville) {
      countQuery += ' AND ville = ?';
      countParams.push(ville);
    }
    if (search) {
      countQuery += ' AND (nom LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }
    
    db.get(countQuery, countParams, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({
        data: rows || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.count,
          pages: Math.ceil(result.count / limit)
        }
      });
    });
  });
});

// GET field by ID with reviews
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM fields WHERE id = ?', [req.params.id], (err, field) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }
    
    // Get reviews
    db.all(
      `SELECT r.*, u.username FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.field_id = ? 
       ORDER BY r.created_at DESC`,
      [req.params.id],
      (err, reviews) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({
          ...field,
          reviews: reviews || []
        });
      }
    );
  });
});

// ADD a field
router.post('/', (req, res) => {
  const { nom, sport, adresse, ville, taille, horaires, prix, description, image_url, capacity } = req.body;

  // Validation
  if (!nom || !sport || !adresse || !ville || !taille || !prix) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!validateFieldName(nom)) {
    return res.status(400).json({ error: 'Invalid field name' });
  }

  if (!validatePrice(prix)) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  if (taille <= 0 || taille > 500) {
    return res.status(400).json({ error: 'Field size must be between 1 and 500' });
  }

  db.run(
    `INSERT INTO fields (nom, sport, adresse, ville, taille, horaires, prix, description, image_url, capacity) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nom, sport, adresse, ville, taille, horaires, prix, description, image_url || null, capacity || 20],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({
        id: this.lastID,
        nom,
        sport,
        adresse,
        ville,
        taille,
        horaires,
        prix,
        description,
        image_url,
        capacity: capacity || 20,
        message: 'Field created successfully'
      });
    }
  );
});

// UPDATE a field
router.put('/:id', (req, res) => {
  const { nom, sport, adresse, ville, taille, horaires, prix, description, image_url, capacity } = req.body;

  // Validate price if provided
  if (prix !== undefined && !validatePrice(prix)) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  const updateFields = [];
  const values = [];

  if (nom !== undefined) {
    updateFields.push('nom = ?');
    values.push(nom);
  }
  if (sport !== undefined) {
    updateFields.push('sport = ?');
    values.push(sport);
  }
  if (adresse !== undefined) {
    updateFields.push('adresse = ?');
    values.push(adresse);
  }
  if (ville !== undefined) {
    updateFields.push('ville = ?');
    values.push(ville);
  }
  if (taille !== undefined) {
    updateFields.push('taille = ?');
    values.push(taille);
  }
  if (horaires !== undefined) {
    updateFields.push('horaires = ?');
    values.push(horaires);
  }
  if (prix !== undefined) {
    updateFields.push('prix = ?');
    values.push(prix);
  }
  if (description !== undefined) {
    updateFields.push('description = ?');
    values.push(description);
  }
  if (image_url !== undefined) {
    updateFields.push('image_url = ?');
    values.push(image_url);
  }
  if (capacity !== undefined) {
    updateFields.push('capacity = ?');
    values.push(capacity);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(req.params.id);

  db.run(
    `UPDATE fields SET ${updateFields.join(', ')} WHERE id = ?`,
    values,
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Field not found' });
      }
      res.json({ message: 'Field updated successfully' });
    }
  );
});

// DELETE a field
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM fields WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Field not found' });
    }
    res.json({ message: 'Field deleted successfully' });
  });
});

// GET fields by sport
router.get('/sport/:sport', (req, res) => {
  db.all(
    'SELECT * FROM fields WHERE sport = ? ORDER BY rating DESC, created_at DESC',
    [req.params.sport],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows || []);
    }
  );
});

// GET fields by city
router.get('/city/:ville', (req, res) => {
  db.all(
    'SELECT * FROM fields WHERE ville = ? ORDER BY rating DESC, created_at DESC',
    [req.params.ville],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows || []);
    }
  );
});

module.exports = router;
