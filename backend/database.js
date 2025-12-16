const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

// Enable foreign keys - TRÈS IMPORTANT pour SQLite
db.run("PRAGMA foreign_keys = ON", (err) => {
  if (err) {
    console.error("Error enabling foreign keys:", err);
  } else {
    console.log("Foreign keys enabled");
  }
});

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

  // Table pour gérer les créneaux horaires réservés
  db.run(`
    CREATE TABLE IF NOT EXISTS time_slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservation_id INTEGER NOT NULL,
      field_id INTEGER NOT NULL,
      reservation_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
      FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
      UNIQUE(field_id, reservation_date, time_slot)
    )
  `, (err) => {
    if (err) {
      console.error("Error creating time_slots table:", err);
    } else {
      console.log("time_slots table ready");
    }
  });

  db.run(`CREATE INDEX IF NOT EXISTS idx_time_slots_field_date ON time_slots(field_id, reservation_date)`);

  // SEED DATA - Insert original fields with specific images
  db.run(`
    INSERT OR IGNORE INTO fields (id, nom, sport, adresse, ville, taille, horaires, date, prix, description, image_url, capacity)
    VALUES 
      (1, 'Central Field', 'Football', '123 Rue de Paris', 'Paris', 5000, '08:00 - 22:00', '2024-12-31', 25, 'Professional football field with night lighting. Excellent grass condition.', '/Image/Foot.webp', 20),
      (2, 'Hall 32', 'Basketball', '456 Avenue Lyon', 'Lyon', 2500, '08:00 - 22:00', '2024-12-31', 30, 'Air-conditioned hall with modern equipment for basketball.', '/Image/Baskette.jpg', 20),
      (3, 'Blue Court', 'Tennis', '789 Route Tennis', 'Marseille', 800, '08:00 - 22:00', '2024-12-31', 20, 'Tennis court with hard blue surface.', '/Image/Tennis.jpg', 20),
      (4, 'Green Arena', 'Badminton', '321 Boulevard Badminton', 'Nice', 600, '08:00 - 22:00', '2024-12-31', 15, 'Indoor badminton court with synthetic flooring.', '/Image/Badminton.jpg', 20),
      (5, 'Spike Zone', 'Volleyball', '654 Street Volleyball', 'Toulouse', 1200, '08:00 - 22:00', '2024-12-31', 18, 'Volleyball court with sand surface for beach volleyball.', '/Image/Volley.webp', 20),
      (6, 'Downtown Field', 'Football', '987 Central Ave', 'Bordeaux', 4000, '08:00 - 22:00', '2024-12-31', 22, 'Spacious football field located in the city center.', '/Image/Football2.jpg', 20),
      (7, 'Sunset Tennis', 'Tennis', '159 Sunset Blvd', 'Nantes', 900, '08:00 - 22:00', '2024-12-31', 21, 'Tennis court with beautiful sunset views.', '/Image/Tennis2.jpg', 20),
      (8, 'City Hoops', 'Basketball', '753 City St', 'Strasbourg', 2700, '08:00 - 22:00', '2024-12-31', 28, 'Modern basketball court in the heart of the city.', '/Image/Basket2.jpg', 20),
      (9, 'Rapid Badminton', 'Badminton', '852 Rapid Rd', 'Montpellier', 650, '08:00 - 22:00', '2024-12-31', 16, 'Fast-paced badminton court with great lighting.', '/Image/Badminton2.jpg', 20),
      (10, 'Beach Volleyball Court', 'Volleyball', '147 Beach Ave', 'Cannes', 1300, '08:00 - 22:00', '2024-12-31', 19, 'Outdoor beach volleyball court with sand surface.', '/Image/Volley2.jpg', 20),
      (11, 'Elite Football Pitch', 'Football', '369 Elite St', 'Lille', 4500, '08:00 - 22:00', '2024-12-31', 27, 'High-quality football pitch with excellent facilities.', '/Image/Football3.jpg', 20),
      (12, 'Grand Slam Tennis', 'Tennis', '258 Grand Ave', 'Rennes', 850, '08:00 - 22:00', '2024-12-31', 23, 'Tennis court designed for grand slam level play.', '/Image/Tennis3.jpg', 20),
      (13, 'Pro Basketball Court', 'Basketball', '147 Pro St', 'Grenoble', 3000, '08:00 - 22:00', '2024-12-31', 32, 'Professional-grade basketball court with top amenities.', '/Image/Basket3.jpg', 20)
  `);
  
  // Créer des utilisateurs de démonstration
  try {
    const bcrypt = require('bcrypt');
    const adminPassword = bcrypt.hashSync('admin123', 10);
    const userPassword = bcrypt.hashSync('user123', 10);
    
    db.run(`
      INSERT OR IGNORE INTO users (id, email, username, password, role)
      VALUES (1, 'admin@sportcity.com', 'admin', ?, 'admin')
    `, [adminPassword], (err) => {
      if (err) {
        console.error('Error creating admin user:', err);
      } else {
        console.log('Admin user ready: admin@sportcity.com / admin123');
      }
    });
  } catch (error) {
    console.error('⚠️ bcrypt not available, skipping user creation');
    console.log('Install bcrypt: npm install bcrypt');
  }

  // SEED REVIEWS DATA
  setTimeout(() => {
    db.run(`
      INSERT OR IGNORE INTO reviews (field_id, user_id, rating, comment, created_at)
      VALUES 
        (1, 2, 5, 'Amazing field! The grass is perfectly maintained and the lighting is excellent for evening games. Definitely coming back!', datetime('now', '-10 days')),
        (1, 4, 5, 'Best football field in Paris! Professional quality turf and friendly staff. Worth every euro.', datetime('now', '-5 days')),
        (1, 5, 4, 'Very good condition. Could use some more trash cans, but otherwise perfect for our team practice.', datetime('now', '-3 days')),
        
        (2, 2, 5, 'Outstanding basketball court! The climate control is perfect and the hoops are regulation height. Loved it!', datetime('now', '-12 days')),
        (2, 6, 4, 'Good quality court. Some squeaking on the floor but nothing serious. Great for pickup games.', datetime('now', '-7 days')),
        (2, 7, 5, 'The best indoor basketball experience! Professional court, great atmosphere. Highly recommend!', datetime('now', '-4 days')),
        
        (3, 5, 4, 'Nice tennis court with good maintenance. The only downside is limited parking nearby.', datetime('now', '-6 days')),
        (3, 8, 5, 'Excellent facility! The hard court surface is ideal for serious matches. Will definitely book again!', datetime('now', '-2 days')),
        
        (4, 4, 5, 'Fantastic badminton court! The lighting is perfect and the floor is very responsive. Loved every minute.', datetime('now', '-11 days')),
        (4, 6, 4, 'Good badminton facility. A bit cramped during peak hours but well-maintained.', datetime('now', '-6 days')),
        
        (5, 2, 5, 'Best volleyball court ever! The sand is clean and the setup is professional. Had an incredible game here!', datetime('now', '-8 days')),
        (5, 7, 4, 'Nice volleyball court with good sand quality. Wish there were more shade areas nearby.', datetime('now', '-4 days')),
        
        (6, 4, 4, 'Good field with decent facilities. Slightly noisy from the street but nothing that ruins the experience.', datetime('now', '-5 days')),
        (6, 8, 5, 'Perfect for casual and serious matches. Great location and impeccable maintenance!', datetime('now', '-1 days')),
        
        (7, 5, 5, 'The sunset views while playing tennis are absolutely beautiful! Court quality is also top-notch.', datetime('now', '-9 days')),
        (7, 6, 5, 'Amazing experience! The scenic location combined with excellent court condition makes this my favorite spot.', datetime('now', '-3 days')),
        
        (8, 2, 4, 'Nice modern court. Good facilities overall. Could use better ventilation but otherwise great!', datetime('now', '-7 days')),
        (8, 7, 5, 'Excellent city basketball court! Professional setup, great atmosphere, highly recommended!', datetime('now', '-2 days')),
        
        (9, 4, 4, 'Good badminton court with fast flooring. Only minor issue is limited seating for spectators.', datetime('now', '-6 days')),
        
        (10, 5, 5, 'Beautiful beach volleyball court! Perfect sand and amazing ocean views. Absolutely loved it!', datetime('now', '-10 days')),
        (10, 8, 5, 'One of the best volleyball courts Ive played on! Great location, great setup, highly recommend!', datetime('now', '-1 days')),
        
        (11, 2, 5, 'Elite quality football pitch! Professional-grade maintenance and excellent facilities throughout.', datetime('now', '-9 days')),
        (11, 4, 4, 'Great football field. Well-maintained and spacious. Just a bit pricey but worth it.', datetime('now', '-4 days')),
        (11, 6, 5, 'Outstanding! This is the kind of pitch serious teams dream about. Perfect in every way!', datetime('now', '-2 days')),
        
        (12, 7, 5, 'Professional tennis facility! Would totally recommend this to anyone serious about tennis.', datetime('now', '-5 days')),
        
        (13, 5, 5, 'Pro-grade basketball court! Regulation everything, perfect condition. This is where I come for serious play!', datetime('now', '-8 days')),
        (13, 8, 4, 'Excellent pro court. Facilities are top-notch. Parking could be better but overall very satisfied.', datetime('now', '-3 days'))
      `
    , (err) => {
      if (err && !err.message.includes('UNIQUE constraint failed')) {
        console.error('Error seeding reviews:', err);
      } else {
        console.log('✅ Review data seeded successfully');
        
        // Update field ratings based on reviews
        db.run(`
          UPDATE fields 
          SET rating = (
            SELECT AVG(rating) FROM reviews WHERE reviews.field_id = fields.id
          ),
          review_count = (
            SELECT COUNT(*) FROM reviews WHERE reviews.field_id = fields.id
          )
          WHERE id IN (SELECT DISTINCT field_id FROM reviews)
        `, (err) => {
          if (err) {
            console.error('Error updating field ratings:', err);
          } else {
            console.log('✅ Field ratings updated');
          }
        });
      }
    });
  }, 1000);

});

module.exports = db;
