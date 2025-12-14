<template>
  <div class="sitemap-container">
    <h1>Site Map</h1>
    <div class="sitemap-content">
      <section class="sitemap-section">
        <h2>Main Pages</h2>
        <ul>
          <li><router-link to="/">Home</router-link> - Browse and rent sports fields</li>
          <li><router-link to="/about">About</router-link> - Learn about SportCity's mission and objectives</li>
          <li><router-link to="/contact">Contact</router-link> - Get in touch with our team</li>
          <li><router-link to="/sitemap">Site Map</router-link> - Overview of all site pages</li>
        </ul>
      </section>

      <section class="sitemap-section">
        <h2>User Account</h2>
        <ul>
          <li><router-link to="/login">Login</router-link> - Sign in to your account</li>
          <li><router-link to="/signup">Sign Up</router-link> - Create a new account</li>
          <li><router-link to="/profile">Profile</router-link> - Manage your profile and reservations</li>
        </ul>
      </section>

      <section class="sitemap-section">
        <h2>Features</h2>
        <ul>
          <li>Field Search - Filter and search for sports fields</li>
          <li>Field Details - View detailed information about fields</li>
          <li>Add/Edit Fields - Admin feature to manage field listings</li>
          <li>Reservations - Book and manage your field rentals</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SitemapView'
}
</script>

<style scoped>
.sitemap-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease;
}

h1 {
  text-align: center;
  color: #2f80ed;
  margin-bottom: 40px;
  font-size: 2.5rem;
}

.sitemap-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.sitemap-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #2f80ed;
}

.sitemap-section h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 1.5rem;
}

.sitemap-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sitemap-section li {
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.sitemap-section li:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.sitemap-section a {
  color: #2f80ed;
  text-decoration: none;
  font-weight: 500;
}

.sitemap-section a:hover {
  text-decoration: underline;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .sitemap-container {
    margin: 20px;
    padding: 15px;
  }

  h1 {
    font-size: 2rem;
  }

  .sitemap-section {
    padding: 15px;
  }
}
</style>
