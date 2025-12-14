<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="copyright">
        <p>&copy; 2025 – SportCity. All rights reserved.</p>
      </div>
      <nav class="footer-nav">
        <ul>
          <li><router-link to="/about">About</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
          <li><router-link to="/sitemap">Site Map</router-link></li>
        </ul>
      </nav>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.footer {
  background-color: #2c3e50;
  color: white;
  padding: 20px 0;
  margin-top: auto;
  text-align: center;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.copyright p {
  margin: 0;
  font-size: 14px;
}

.footer-nav ul {
  list-style: none;
  padding: 0;
  margin: 10px 0;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.footer-nav a {
  color: white;
  text-decoration: none;
  font-size: 14px;
}

.footer-nav a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .footer-nav ul {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
