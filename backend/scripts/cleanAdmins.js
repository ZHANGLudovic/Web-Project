const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const db = new sqlite3.Database("./database.db");

console.log("🧹 Cleaning admin accounts...\n");

db.serialize(() => {
  // First, show all current users
  db.all("SELECT id, email, username, role FROM users", [], (err, users) => {
    if (err) {
      console.error("Error fetching users:", err);
      return;
    }

    console.log("📋 Current users in database:");
    console.table(users);

    // Delete all admin accounts
    db.run("DELETE FROM users WHERE role = 'admin'", function(err) {
      if (err) {
        console.error("Error deleting admins:", err);
        return;
      }

      console.log(`\n🗑️  Deleted ${this.changes} admin account(s)`);

      // Create the single admin account
      const adminPassword = bcrypt.hashSync('admin123', 10);
      
      db.run(`
        INSERT INTO users (email, username, password, role)
        VALUES (?, ?, ?, 'admin')
      `, ['admin@sportcity.com', 'admin', adminPassword], function(err) {
        if (err) {
          console.error("Error creating admin:", err);
          return;
        }

        console.log("\n✅ New admin account created!");
        console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📧 Admin Login Credentials:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("Email:    admin@sportcity.com");
        console.log("Password: admin123");
        console.log("Role:     admin");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

        // Show final user list
        db.all("SELECT id, email, username, role FROM users", [], (err, finalUsers) => {
          if (err) {
            console.error("Error fetching final users:", err);
            db.close();
            return;
          }

          console.log("📋 Final users in database:");
          console.table(finalUsers);

          const adminCount = finalUsers.filter(u => u.role === 'admin').length;
          const userCount = finalUsers.filter(u => u.role === 'user').length;

          console.log(`\n📊 Summary:`);
          console.log(`   👑 Admins: ${adminCount}`);
          console.log(`   👤 Users:  ${userCount}`);
          console.log(`   📝 Total:  ${finalUsers.length}\n`);

          console.log("✨ Cleanup complete!\n");
          db.close();
        });
      });
    });
  });
});
