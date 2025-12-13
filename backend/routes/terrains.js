const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all terrains
router.get('/', (req, res) => {
  db.all('SELECT * FROM terrains ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// GET terrain by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM terrains WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Terrain not found' });
    }
    res.json(row);
  });
});

// ADD a terrain
router.post('/', (req, res) => {
  const { nom, sport, adresse, ville, taille, horaires, date, prix, description } = req.body;

  if (!nom || !sport || !adresse || !ville || !taille || !prix) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    'INSERT INTO terrains (nom, sport, adresse, ville, taille, horaires, date, prix, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nom, sport, adresse, ville, taille, horaires, date, prix, description],
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
        date,
        prix,
        description
      });
    }
  );
});

// UPDATE a terrain
router.put('/:id', (req, res) => {
  const { nom, sport, adresse, ville, taille, horaires, date, prix, description } = req.body;

  db.run(
    'UPDATE terrains SET nom = ?, sport = ?, adresse = ?, ville = ?, taille = ?, horaires = ?, date = ?, prix = ?, description = ? WHERE id = ?',
    [nom, sport, adresse, ville, taille, horaires, date, prix, description, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Terrain not found' });
      }
      res.json({ message: 'Terrain updated successfully' });
    }
  );
});

// DELETE a terrain
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM terrains WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Terrain not found' });
    }
    res.json({ message: 'Terrain deleted successfully' });
  });
});

module.exports = router;
