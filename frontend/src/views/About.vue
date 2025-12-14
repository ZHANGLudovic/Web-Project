<template>
  <div class="about-container">
    <h1>About SportCity</h1>
    <div class="about-content">
      <section class="mission">
        <h2>Our Mission</h2>
        <p>
          SportCity is an innovative platform dedicated to the management and rental of sports fields.
          Our main objective is to facilitate access to sports facilities for all sports enthusiasts,
          by creating a direct link between field owners and users wishing to practice their favorite activity.
        </p>
      </section>

      <section class="objectives">
        <h2>Our Objectives</h2>
        <ul>
          <li>
            <strong>Simplify rentals:</strong> Offer a smooth user experience for booking sports fields in a few clicks.
          </li>
          <li>
            <strong>Optimize management:</strong> Allow field owners to easily manage their facilities and bookings.
          </li>
          <li>
            <strong>Promote sports:</strong> Encourage sports practice by making fields more accessible and affordable.
          </li>
          <li>
            <strong>Ensure quality:</strong> Guarantee well-maintained fields and secure bookings for all users.
          </li>
        </ul>
      </section>

      <section class="features">
        <h2>What We Offer</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>🏟️ Variety of fields</h3>
            <p>Football, basketball, tennis, volleyball and many other sports available.</p>
          </div>
          <div class="feature-card">
            <h3>📅 Easy booking</h3>
            <p>Book your fields online 24/7 with secure payment system.</p>
          </div>
          <div class="feature-card">
            <h3>👥 Sports community</h3>
            <p>Join a community of passionate athletes and share your experiences.</p>
          </div>
          <div class="feature-card">
            <h3>📍 Precise location</h3>
            <p>Find fields near you thanks to our geolocation system.</p>
          </div>
        </div>
      </section>

      <section class="vision">
        <h2>Our Vision</h2>
        <p>
          We believe that sports should be accessible to everyone, regardless of age, level, or budget.
          SportCity aspires to become the world reference in sports field rental,
          by combining innovative technology and passion for sports.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>

<style scoped>
.about-container {
  max-width: 1000px;
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

.about-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

section {
  padding: 20px 0;
}

h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.8rem;
  border-bottom: 2px solid #2f80ed;
  padding-bottom: 10px;
}

p {
  line-height: 1.6;
  color: #555;
  font-size: 1.1rem;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #2f80ed;
}

ul li strong {
  color: #2f80ed;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.feature-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.feature-card h3 {
  color: #2f80ed;
  margin-bottom: 10px;
}

.feature-card p {
  color: #666;
  font-size: 1rem;
}

.vision p {
  font-style: italic;
  text-align: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-radius: 8px;
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
  .about-container {
    margin: 20px;
    padding: 15px;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  ul li {
    padding: 12px;
  }
}
</style>
