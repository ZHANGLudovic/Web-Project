<template>
  <div class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ field.nom }}</h2>
        <button @click="close" class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <div class="details-grid">
          <div class="detail-section">
            <h3>General Information</h3>
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
            <h3>Characteristics</h3>
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
            <h3>Availability</h3>
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
          <h3>Description</h3>
          <div class="description-text">
            {{ field.description }}
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="close" class="close-action-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FieldDetails',
  props: {
    field: {
      type: Object,
      required: true
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    formatDate(date) {
      if (!date) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('fr-FR', options);
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  background: linear-gradient(135deg, #2f80ed 0%, #1e5cb8 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: white;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: transform 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.1);
}

.modal-body {
  padding: 25px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 25px;
}

.detail-section {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #2f80ed;
}

.detail-section h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-item {
  margin-bottom: 16px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item label {
  display: block;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.detail-item p {
  margin: 0;
  color: #333;
  font-size: 15px;
  line-height: 1.5;
}

.sport-badge {
  display: inline-block;
  background-color: #2f80ed;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.full-width {
  grid-column: 1 / -1;
  border-left-color: #4CAF50;
}

.description-text {
  color: #333;
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 20px 25px;
  background-color: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  border-radius: 0 0 12px 12px;
  position: sticky;
  bottom: 0;
}

.close-action-btn {
  padding: 12px 24px;
  background-color: #2f80ed;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.close-action-btn:hover {
  background-color: #1e5cb8;
}

/* Scrollbar styling */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
