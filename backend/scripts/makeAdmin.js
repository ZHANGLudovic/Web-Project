const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

// Change this to the email you want to make admin
const EMAIL_TO_PROMOTE = "votre-email@example.com"; // ⬅️ CHANGEZ CECI

console.log(`🔄 Making ${EMAIL_TO_PROMOTE} an admin...\n`);

db.get("SELECT * FROM users WHERE email = ?", [EMAIL_TO_PROMOTE], (err, user) => {
  if (err) {
    console.error("Error:", err);
    db.close();
    return;
  }

  if (!user) {
    console.error(`❌ User not found: ${EMAIL_TO_PROMOTE}`);
    console.log("\n📋 Available users:");
    
    db.all("SELECT id, email, username, role FROM users", [], (err, users) => {
      if (!err) {
        console.table(users);
      }
      db.close();
    });
    return;
  }

  db.run("UPDATE users SET role = 'admin' WHERE email = ?", [EMAIL_TO_PROMOTE], function(err) {
    if (err) {
      console.error("Error updating user:", err);
      db.close();
      return;
    }

    console.log(`✅ ${EMAIL_TO_PROMOTE} is now an admin!`);
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👑 Admin Account:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Email:    ${user.email}`);
    console.log(`Username: ${user.username}`);
    console.log(`Role:     admin`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    db.close();
  });
});
