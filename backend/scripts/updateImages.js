const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

console.log("Updating field images...\n");

const imageUpdates = [
  { id: 1, image_url: '/Image/Foot.webp' },
  { id: 2, image_url: '/Image/Baskette.jpg' },
  { id: 3, image_url: '/Image/Tennis.jpg' },
  { id: 4, image_url: '/Image/Badminton.jpg' },      // ✅ UPDATED
  { id: 5, image_url: '/Image/Volley.webp' },
  { id: 6, image_url: '/Image/Football2.jpg' },
  { id: 7, image_url: '/Image/Tennis2.jpg' },
  { id: 8, image_url: '/Image/Basket2.jpg' },
  { id: 9, image_url: '/Image/Badminton2.jpg' },     // ✅ UPDATED
  { id: 10, image_url: '/Image/Volley2.jpg' },
  { id: 11, image_url: '/Image/Football3.jpg' },
  { id: 12, image_url: '/Image/Tennis3.jpg' },
  { id: 13, image_url: '/Image/Basket3.jpg' }        // ✅ UPDATED
];

db.serialize(() => {
  let completed = 0;
  
  imageUpdates.forEach(({ id, image_url }) => {
    db.run(
      "UPDATE fields SET image_url = ? WHERE id = ?",
      [image_url, id],
      function(err) {
        if (err) {
          console.error(`Error updating field ${id}:`, err);
        } else {
          console.log(`Updated field ${id} -> ${image_url}`);
        }
        
        completed++;
        if (completed === imageUpdates.length) {
          console.log("\nVerification - All fields:\n");
          
          db.all("SELECT id, nom, sport, image_url FROM fields ORDER BY id", [], (err, rows) => {
            if (err) {
              console.error("Error:", err);
            } else {
              console.table(rows);
              console.log("\nImages updated successfully!\n");
            }
            db.close();
          });
        }
      }
    );
  });
});
