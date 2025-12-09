const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || './database.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database at:', DB_PATH);
});

// Create tables
const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.log('Users table already exists or error:', err.message);
      });

      // Terrains table
      db.run(`
        CREATE TABLE IF NOT EXISTS terrains (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nom TEXT NOT NULL,
          sport TEXT NOT NULL,
          adresse TEXT NOT NULL,
          ville TEXT NOT NULL,
          taille INTEGER NOT NULL,
          horaires TEXT,
          date TEXT,
          prix REAL NOT NULL,
          description TEXT,
          user_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) console.log('Terrains table already exists or error:', err.message);
        resolve();
      });
    });
  });
};

// Initialize database
const initializeDatabase = async () => {
  try {
    await createTables();
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

module.exports = { db, initializeDatabase };
