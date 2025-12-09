const express = require('express');
const { db } = require('../database');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Helper functions for database operations
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get all terrains
router.get('/', async (req, res) => {
  try {
    const terrains = await dbAll('SELECT * FROM terrains ORDER BY created_at DESC');
    res.json(terrains || []);
  } catch (error) {
    console.error('Get terrains error:', error);
    res.status(500).json({ error: 'Server error fetching terrains' });
  }
});

// Get terrain by ID
router.get('/:id', async (req, res) => {
  try {
    const terrain = await dbGet('SELECT * FROM terrains WHERE id = ?', [req.params.id]);
    if (!terrain) {
      return res.status(404).json({ error: 'Terrain not found' });
    }
    res.json(terrain);
  } catch (error) {
    console.error('Get terrain error:', error);
    res.status(500).json({ error: 'Server error fetching terrain' });
  }
});

// Get terrains by user (requires authentication)
router.get('/user/my-terrains', authenticateToken, async (req, res) => {
  try {
    const terrains = await dbAll(
      'SELECT * FROM terrains WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(terrains || []);
  } catch (error) {
    console.error('Get user terrains error:', error);
    res.status(500).json({ error: 'Server error fetching your terrains' });
  }
});

// Create terrain (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nom, sport, adresse, ville, taille, horaires, date, prix, description } = req.body;

    // Validate required fields
    if (!nom || !sport || !adresse || !ville || !taille || !prix) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await dbRun(
      `INSERT INTO terrains (nom, sport, adresse, ville, taille, horaires, date, prix, description, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nom, sport, adresse, ville, taille, horaires, date, prix, description, req.user.id]
    );

    res.status(201).json({
      message: 'Terrain created successfully',
      id: result.lastID,
      terrain: { id: result.lastID, nom, sport, adresse, ville, taille, horaires, date, prix, description, user_id: req.user.id }
    });
  } catch (error) {
    console.error('Create terrain error:', error);
    res.status(500).json({ error: 'Server error creating terrain' });
  }
});

// Update terrain (requires authentication)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { nom, sport, adresse, ville, taille, horaires, date, prix, description } = req.body;

    // Check if terrain exists and belongs to user
    const terrain = await dbGet('SELECT * FROM terrains WHERE id = ?', [req.params.id]);
    if (!terrain) {
      return res.status(404).json({ error: 'Terrain not found' });
    }

    if (terrain.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this terrain' });
    }

    // Update terrain
    await dbRun(
      `UPDATE terrains SET nom = ?, sport = ?, adresse = ?, ville = ?, taille = ?, horaires = ?, date = ?, prix = ?, description = ? 
       WHERE id = ?`,
      [nom || terrain.nom, sport || terrain.sport, adresse || terrain.adresse, ville || terrain.ville, 
       taille || terrain.taille, horaires || terrain.horaires, date || terrain.date, prix || terrain.prix, 
       description || terrain.description, req.params.id]
    );

    res.json({
      message: 'Terrain updated successfully',
      id: req.params.id
    });
  } catch (error) {
    console.error('Update terrain error:', error);
    res.status(500).json({ error: 'Server error updating terrain' });
  }
});

// Delete terrain (requires authentication)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if terrain exists and belongs to user
    const terrain = await dbGet('SELECT * FROM terrains WHERE id = ?', [req.params.id]);
    if (!terrain) {
      return res.status(404).json({ error: 'Terrain not found' });
    }

    if (terrain.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this terrain' });
    }

    // Delete terrain
    await dbRun('DELETE FROM terrains WHERE id = ?', [req.params.id]);

    res.json({ message: 'Terrain deleted successfully' });
  } catch (error) {
    console.error('Delete terrain error:', error);
    res.status(500).json({ error: 'Server error deleting terrain' });
  }
});

// Search terrains by sport or city
router.get('/search/:query', async (req, res) => {
  try {
    const query = `%${req.params.query}%`;
    const terrains = await dbAll(
      `SELECT * FROM terrains WHERE nom LIKE ? OR ville LIKE ? OR sport LIKE ? ORDER BY created_at DESC`,
      [query, query, query]
    );
    res.json(terrains || []);
  } catch (error) {
    console.error('Search terrains error:', error);
    res.status(500).json({ error: 'Server error searching terrains' });
  }
});

module.exports = router;
