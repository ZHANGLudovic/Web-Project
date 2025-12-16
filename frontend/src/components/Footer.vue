<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <div class="footer-logo">
          <span class="logo-icon">⚽</span>
          <span class="logo-text">SportCity</span>
        </div>
        <p class="footer-tagline">
          Your ultimate platform for booking sports fields. Play your favorite sport anytime, anywhere.
        </p>
      </div>

      <div class="footer-links-container">
        <div class="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/about">About Us</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
            <li><router-link to="/sitemap">Sitemap</router-link></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4>Sports</h4>
          <ul>
            <li><a @click="filterBySport('Football')">⚽ Football</a></li>
            <li><a @click="filterBySport('Basketball')">🏀 Basketball</a></li>
            <li><a @click="filterBySport('Tennis')">🎾 Tennis</a></li>
            <li><a @click="filterBySport('Volleyball')">🏐 Volleyball</a></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4>Connect</h4>
          <div class="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="social-link">
              <span>f</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="social-link">
              <span>𝕏</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="social-link">
              <span>📷</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="social-link">
              <span>in</span>
            </a>
          </div>
          <div class="contact-info">
            <p><a href="mailto:contact@sportcity.com">contact@sportcity.com</a></p>
            <p><a href="tel:+33123456789">+33 1 23 45 67 89</a></p>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© {{ currentYear }} SportCity. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  },
  methods: {
    filterBySport(sport) {
      this.$router.push({ path: '/', query: { sport } });
    }
  }
};
</script>

<style scoped>
.footer {
  background: #1a202c;
  color: #e2e8f0;
  padding: 50px 20px 20px;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 2fr;
  gap: 60px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-brand {
  max-width: 350px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 2px 8px rgba(102, 126, 234, 0.4));
}

.logo-text {
  font-size: 1.75rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.footer-tagline {
  color: #a0aec0;
  font-size: 14px;
  line-height: 1.7;
}

.footer-links-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer-column h4 {
  color: white;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column ul li {
  margin-bottom: 12px;
}

.footer-column a {
  color: #cbd5e0;
  font-size: 14px;
  transition: var(--transition);
  cursor: pointer;
  display: inline-block;
}

.footer-column a:hover {
  color: white;
  transform: translateX(3px);
}

.social-links {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.social-link {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
  transition: var(--transition);
}

.social-link:hover {
  background: var(--primary-gradient);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-info p {
  margin: 0;
  font-size: 14px;
}

.contact-info a {
  color: #cbd5e0;
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 30px;
  text-align: center;
}

.footer-bottom p {
  color: #718096;
  font-size: 14px;
  margin: 0;
}

/* Responsive */
@media (max-width: 968px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .footer-brand {
    max-width: 100%;
  }

  .footer-links-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .footer {
    padding: 40px 15px 20px;
  }

  .footer-content {
    gap: 30px;
  }

  .footer-links-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-column h4 {
    font-size: 15px;
  }

  .logo-text {
    font-size: 1.5rem;
  }

  .logo-icon {
    font-size: 2rem;
  }
}
</style>
