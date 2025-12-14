<template>
  <div class="contact-container">
    <h2>Contact Us</h2>
    <p>Get in touch with our team members via LinkedIn:</p>
    <div class="contact-links">
      <div class="contact-card">
        <h3>Ludovic Zhang</h3>
        <a href="https://www.linkedin.com/in/ludovic-zhang-9bb1aa292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" class="linkedin-link">
          <span class="icon">💼</span> View LinkedIn Profile
        </a>
      </div>
      <div class="contact-card">
        <h3>Timothée Boisseaux</h3>
        <a href="https://www.linkedin.com/in/timothée-boisseaux-b8b75b291?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" class="linkedin-link">
          <span class="icon">💼</span> View LinkedIn Profile
        </a>
      </div>
      <div class="contact-card">
        <h3>Nazim Mekideche</h3>
        <a href="https://www.linkedin.com/in/nazim-mekideche-1a24b32ba?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" class="linkedin-link">
          <span class="icon">💼</span> View LinkedIn Profile
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactView'
}
</script>

<style scoped>
.contact-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  color: #333;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 30px;
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.contact-card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.contact-card h3 {
  margin: 0 0 10px 0;
  color: #2f80ed;
}

.linkedin-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #0077b5;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.linkedin-link:hover {
  background-color: #005885;
}

.icon {
  font-size: 18px;
}

@media (max-width: 768px) {
  .contact-container {
    margin: 20px;
    padding: 15px;
  }

  .contact-links {
    gap: 15px;
  }

  .contact-card {
    padding: 15px;
  }
}
</style>
