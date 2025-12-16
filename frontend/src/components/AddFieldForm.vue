<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Add New Field</h2>
        <button @click="$emit('close')" class="close-btn">✕</button>
      </div>

      <form @submit.prevent="submitForm" class="field-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="name">Field Name *</label>
            <input 
              v-model="formData.name" 
              id="name" 
              type="text" 
              placeholder="e.g., Central Stadium"
              required
            />
          </div>

          <div class="form-group">
            <label for="type">Sport Type *</label>
            <select v-model="formData.type" id="type" required>
              <option value="">Select a sport</option>
              <option value="Football">Football</option>
              <option value="Basketball">Basketball</option>
              <option value="Tennis">Tennis</option>
              <option value="Volleyball">Volleyball</option>
              <option value="Badminton">Badminton</option>
            </select>
          </div>

          <div class="form-group">
            <label for="ville">City *</label>
            <input 
              v-model="formData.ville" 
              id="ville" 
              type="text" 
              placeholder="e.g., Paris"
              required
            />
          </div>

          <div class="form-group">
            <label for="location">Address *</label>
            <input 
              v-model="formData.location" 
              id="location" 
              type="text" 
              placeholder="e.g., 123 Main Street"
              required
            />
          </div>

          <div class="form-group">
            <label for="size">Size (m²) *</label>
            <input 
              v-model.number="formData.size" 
              id="size" 
              type="number" 
              min="0"
              placeholder="e.g., 5000"
              required
            />
          </div>

          <div class="form-group">
            <label for="prix">Price per hour (€) *</label>
            <input 
              v-model.number="formData.prix" 
              id="prix" 
              type="number" 
              min="0"
              step="0.01"
              placeholder="e.g., 25"
              required
            />
          </div>

          <div class="form-group full-width">
            <label for="horaires">Opening Hours *</label>
            <input 
              v-model="formData.horaires" 
              id="horaires" 
              type="text" 
              placeholder="e.g., 08:00 - 22:00"
              required
            />
          </div>

          <div class="form-group full-width">
            <label for="description">Description</label>
            <textarea 
              v-model="formData.description" 
              id="description" 
              rows="4"
              placeholder="Describe the field facilities, amenities, etc."
            ></textarea>
          </div>

          <div class="form-group full-width">
            <label for="image">Image URL</label>
            <input 
              v-model="formData.image" 
              id="image" 
              type="url" 
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn-cancel">
            Cancel
          </button>
          <button type="submit" class="btn-submit">
            <span class="btn-icon">+</span>
            Add Field
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddFieldForm',
  data() {
    return {
      formData: {
        name: '',
        type: '',
        location: '',
        ville: '',
        size: null,
        horaires: '',
        prix: null,
        description: '',
        image: ''
      }
    };
  },
  methods: {
    submitForm() {
      this.$emit('submit', this.formData);
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        name: '',
        type: '',
        location: '',
        ville: '',
        size: null,
        horaires: '',
        prix: null,
        description: '',
        image: ''
      };
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px 30px;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 24px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.field-form {
  padding: 30px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s ease;
  background: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group select {
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.btn-cancel,
.btn-submit {
  padding: 12px 28px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
  color: #333;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-submit:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 20px;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }

  .modal-header {
    padding: 20px;
  }

  .modal-header h2 {
    font-size: 20px;
  }

  .field-form {
    padding: 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}
</style>
