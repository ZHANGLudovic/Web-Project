const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

// CREATE TABLES
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      username TEXT UNIQUE,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS fields (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      sport TEXT NOT NULL,
      adresse TEXT NOT NULL,
      ville TEXT NOT NULL,
      taille INTEGER NOT NULL,
      horaires TEXT,
      date TEXT,
      prix REAL NOT NULL CHECK(prix >= 0),
      description TEXT,
      image_url TEXT,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      user_id INTEGER,
      capacity INTEGER DEFAULT 20,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create index for faster queries
  db.run(`CREATE INDEX IF NOT EXISTS idx_fields_sport ON fields(sport)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_fields_ville ON fields(ville)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_fields_user ON fields(user_id)`);

  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      field_id INTEGER NOT NULL,
      reservation_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      status TEXT DEFAULT 'confirmed',
      total_price REAL NOT NULL CHECK(total_price >= 0),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (field_id) REFERENCES fields(id),
      UNIQUE(field_id, reservation_date, start_time)
    )
  `);

  // Create index for faster queries
  db.run(`CREATE INDEX IF NOT EXISTS idx_reservations_user ON reservations(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_reservations_field ON reservations(field_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status)`);

  db.run(`
    CREATE TABLE IF NOT EXISTS sports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      icon TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      field_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (field_id) REFERENCES fields(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(field_id, user_id)
    )
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_reviews_field ON reviews(field_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id)`);

  // SEED DATA - Insert original fields if they don't exist
  db.run(`
    INSERT OR IGNORE INTO fields (id, nom, sport, adresse, ville, taille, horaires, date, prix, description, image_url, capacity)
    VALUES 
      (1, 'Central Field', 'Football', '123 Rue de Paris', 'Paris', 5000, '09:00 - 18:00', '2024-12-31', 25, 'Professional football field with night lighting. Excellent grass condition.', '/images/foot.webp', 20),
      (2, 'Hall 32', 'Basketball', '456 Avenue Lyon', 'Lyon', 2500, '08:00 - 20:00', '2024-12-31', 30, 'Air-conditioned hall with modern equipment for basketball.', '/images/basketball.jpg', 20),
      (3, 'Blue Court', 'Tennis', '789 Route Tennis', 'Marseille', 800, '07:00 - 19:00', '2024-12-31', 20, 'Tennis court with hard blue surface.', '/images/tennis.jpg', 20)
  `);
});

module.exports = db;
