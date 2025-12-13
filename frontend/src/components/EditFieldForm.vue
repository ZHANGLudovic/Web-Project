<template>
  <div class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Edit Field</h2>
        <button @click="close" class="close-btn">&times;</button>
      </div>
      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="name">Field Name:</label>
          <input v-model="form.name" type="text" id="name" required>
        </div>
        <div class="form-group">
          <label for="location">Address:</label>
          <input v-model="form.location" type="text" id="location" required>
        </div>
        <div class="form-group">
          <label for="ville">City:</label>
          <input v-model="form.ville" type="text" id="ville" required>
        </div>
        <div class="form-group">
          <label for="size">Size (m²):</label>
          <input v-model="form.size" type="number" id="size" required>
        </div>
        <div class="form-group">
          <label for="type">Sport Type:</label>
          <select v-model="form.type" id="type" required>
            <option value="">Select a sport</option>
            <option v-for="sport in sports" :key="sport" :value="sport">
              {{ sport }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="horaires">Hours:</label>
          <input v-model="form.horaires" type="text" id="horaires" placeholder="Ex: 09:00 - 18:00">
        </div>
        <div class="form-group">
          <label for="date">Available Date:</label>
          <input v-model="form.date" type="date" id="date">
        </div>
        <div class="form-group">
          <label for="prix">Price (€/hour):</label>
          <input v-model="form.prix" type="number" id="prix" step="0.01">
        </div>
        <div class="form-group">
          <label for="description">Description (max 500 characters):</label>
          <textarea v-model="form.description" id="description" maxlength="500" rows="4"></textarea>
          <span class="char-count">{{ form.description.length }}/500</span>
        </div>
        <div class="form-group">
          <label>
            Image (optionnelle):
            <input type="file" accept="image/*" @change="onFileChange" />
          </label>
          <input v-model="imageUrl" placeholder="ou URL d'image (optionnel)" />
          <div v-if="preview" class="preview">
            <img :src="preview" alt="preview" />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-btn">Save</button>
          <button type="button" @click="close" class="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditFieldForm',
  props: {
    field: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: '',
        location: '',
        ville: '',
        size: '',
        type: '',
        horaires: '',
        date: '',
        prix: '',
        description: ''
      },
      sports: ['Football', 'Basketball', 'Tennis', 'Volleyball'],
      imageUrl: '',
      preview: this.field.image || null
    };
  },
  watch: {
    field: {
      immediate: true,
      handler(newField) {
        if (newField) {
          this.form = {
            name: newField.nom,
            location: newField.adresse || '',
            ville: newField.ville,
            size: newField.taille || '',
            type: newField.sport,
            horaires: newField.horaires || '',
            date: newField.date || '',
            prix: newField.prix || '',
            description: newField.description || ''
          };
          this.preview = newField.image || null;
        }
      }
    }
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        this.preview = reader.result;
        this.imageUrl = '';
      };
      reader.readAsDataURL(file);
    },
    submit() {
      const payload = {
        ...this.form,
        image: this.preview || (this.imageUrl ? this.imageUrl.trim() : null)
      };
      this.$emit('submit', payload);
    },
    close() {
      this.$emit('close');
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: Arial, sans-serif;
  resize: vertical;
}

.char-count {
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  cursor: pointer;
}

.checkbox-item input[type="radio"] {
  cursor: pointer;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 8px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  white-space: nowrap;
}

.radio-item input[type="radio"] {
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.submit-btn, .cancel-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
}

.submit-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn:hover {
  background-color: #da190b;
}

.preview img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  margin-top: 8px;
}
</style>
