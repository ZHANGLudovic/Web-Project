<template>
  <div class="field-details-page">
    <div class="page-header">
      <router-link to="/" class="back-link">← Back to Fields</router-link>
      <h1>{{ field.nom }}</h1>
    </div>

    <div class="details-content">
      <div class="details-grid">
        <div class="detail-section">
          <h2>General Information</h2>
          <div class="detail-item">
            <label>Sport:</label>
            <span class="sport-badge">{{ field.sport }}</span>
          </div>
          <div class="detail-item">
            <label>Address:</label>
            <p>{{ field.adresse || 'Not specified' }}</p>
          </div>
          <div class="detail-item">
            <label>City:</label>
            <p>{{ field.ville }}</p>
          </div>
        </div>

        <div class="detail-section">
          <h2>Characteristics</h2>
          <div class="detail-item">
            <label>Size:</label>
            <p>{{ field.taille ? field.taille + ' m²' : 'Not specified' }}</p>
          </div>
          <div class="detail-item">
            <label>Price:</label>
            <p>{{ field.prix ? field.prix + '€/hour' : 'Not specified' }}</p>
          </div>
        </div>

        <div class="detail-section">
          <h2>Availability</h2>
          <div class="detail-item">
            <label>Hours:</label>
            <p>{{ field.horaires || 'Not specified' }}</p>
          </div>
          <div class="detail-item">
            <label>Available Date:</label>
            <p>{{ field.date ? formatDate(field.date) : 'Not specified' }}</p>
          </div>
        </div>
      </div>

      <div class="detail-section full-width" v-if="field.description">
        <h2>Description</h2>
        <div class="description-text">
          {{ field.description }}
        </div>
      </div>

      <div class="actions-section">
        <button @click="rentField" class="btn-rent">Rent This Field</button>
        <button @click="editField" v-if="isAdmin" class="btn-edit">Edit Field</button>
      </div>

      <!-- Reviews Section -->
      <ReviewsSection :fieldId="parseInt(field.id || 0)" />
    </div>
  </div>
</template>

<script>
import ReviewsSection from '../components/ReviewsSection.vue';

export default {
  name: 'FieldDetailsPage',
  components: {
    ReviewsSection
  },
  data() {
    return {
      field: null,
      user: null
    };
  },
  computed: {
    isAdmin() {
      return this.user && this.user.role === 'admin';
    }
  },
  mounted() {
    const fieldId = this.$route.params.id;
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch (e) {
        this.user = null;
      }
    }

    // Find field from default fields (in a real app, fetch from API)
    const defaultFields = [
      { id: 1, nom: 'Central Field', sport: 'Football', adresse: '123 Rue de Paris', ville: 'Paris', taille: 5000, horaires: '09:00 - 18:00', date: '2024-12-31', prix: 25, description: 'Professional football field with night lighting. Excellent grass condition.', image: new URL('../Image/Foot.webp', import.meta.url).href },
      { id: 2, nom: 'Hall 32', sport: 'Basketball', adresse: '456 Avenue Lyon', ville: 'Lyon', taille: 2500, horaires: '08:00 - 20:00', date: '2024-12-31', prix: 30, description: 'Air-conditioned hall with modern equipment for basketball.', image: new URL('../Image/Baskette.jpg', import.meta.url).href },
      { id: 3, nom: 'Blue Court', sport: 'Tennis', adresse: '789 Route Tennis', ville: 'Marseille', taille: 800, horaires: '07:00 - 19:00', date: '2024-12-31', prix: 20, description: 'Tennis court with hard blue surface.', image: new URL('../Image/Tennis.jpg', import.meta.url).href },
    ];

    this.field = defaultFields.find(f => f.id == fieldId);
    if (!this.field) {
      // Handle not found
      this.$router.push('/');
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('en-US', options);
    },
    rentField() {
      alert(`You have successfully rented "${this.field.nom}"!`);
      // In a real app, handle reservation logic
    },
    editField() {
      // Emit or navigate to edit (for now, alert)
      alert('Edit functionality would open here.');
    }
  }
}
</script>

<style scoped>
.field-details-page {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.6s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  border-bottom: 3px solid #2f80ed;
  padding-bottom: 20px;
}

.back-link {
  color: #2f80ed;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(47, 128, 237, 0.1);
}

.back-link:hover {
  color: #1e5cb8;
  background: rgba(47, 128, 237, 0.2);
  transform: translateX(-5px);
}

.page-header h1 {
  margin: 0;
  color: #333;
  font-size: 2.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #2f80ed, #1e5cb8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.detail-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 25px;
  border-radius: 12px;
  border-left: 5px solid #2f80ed;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.detail-section:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.detail-section h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #2f80ed;
  font-size: 1.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-item {
  margin-bottom: 18px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item label {
  display: block;
  font-weight: 700;
  color: #495057;
  margin-bottom: 8px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-item p {
  margin: 0;
  color: #6c757d;
  font-size: 16px;
  line-height: 1.6;
  font-weight: 500;
}

.sport-badge {
  display: inline-block;
  background: linear-gradient(135deg, #2f80ed, #1e5cb8);
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(47, 128, 237, 0.3);
}

.full-width {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-left-color: #ffc107;
}

.description-text {
  color: #495057;
  font-size: 16px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-style: italic;
}

.actions-section {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding-top: 40px;
  border-top: 2px solid #e9ecef;
}

.btn-rent, .btn-edit {
  padding: 14px 32px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-rent {
  background: linear-gradient(135deg, #ffc107, #e0a800);
  color: #333;
}

.btn-rent:hover {
  background: linear-gradient(135deg, #e0a800, #d39e00);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(255, 193, 7, 0.4);
}

.btn-edit {
  background: linear-gradient(135deg, #28a745, #218838);
  color: white;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #218838, #1e7e34);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(40, 167, 69, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .field-details-page {
    margin: 20px;
    padding: 15px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .page-header h1 {
    font-size: 2.2rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .actions-section {
    flex-direction: column;
  }

  .btn-rent, .btn-edit {
    width: 100%;
  }
}
</style>
