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
            Image (optional):
            <input type="file" accept="image/*" @change="onFileChange" />
          </label>
          <input v-model="imageUrl" placeholder="or Image URL (optional)" />
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
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 0;
  width: 100%;
  max-width: 650px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 35px;
  background: linear-gradient(135deg, #2f80ed 0%, #1e5cb8 100%);
  color: white;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 4px 12px rgba(47, 128, 237, 0.3);
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: white;
  padding: 8px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

form {
  padding: 35px;
  max-height: 70vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #2f80ed;
  box-shadow: 0 0 0 4px rgba(47, 128, 237, 0.1);
  transform: translateY(-2px);
}

.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  resize: vertical;
  transition: all 0.3s ease;
  box-sizing: border-box;
  min-height: 100px;
}

.form-group textarea:focus {
  outline: none;
  border-color: #2f80ed;
  box-shadow: 0 0 0 4px rgba(47, 128, 237, 0.1);
  transform: translateY(-2px);
}

.char-count {
  display: block;
  font-size: 12px;
  color: #6c757d;
  margin-top: 8px;
  text-align: right;
  font-weight: 500;
}

.preview img {
  width: 140px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.preview img:hover {
  transform: scale(1.05);
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 35px;
  padding-top: 25px;
  border-top: 2px solid #e9ecef;
}

.submit-btn, .cancel-btn {
  flex: 1;
  padding: 14px 24px;
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

.submit-btn {
  background: linear-gradient(135deg, #28a745, #218838);
  color: white;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #218838, #1e7e34);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(40, 167, 69, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

.cancel-btn {
  background: linear-gradient(135deg, #6c757d, #5a6268);
  color: white;
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #5a6268, #495057);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(108, 117, 125, 0.3);
}

.cancel-btn:active {
  transform: translateY(0);
}

/* Scrollbar styling */
form::-webkit-scrollbar {
  width: 8px;
}

form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

form::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

form::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 95%;
    margin: 20px;
  }

  .modal-header {
    padding: 25px 20px;
  }

  .modal-header h2 {
    font-size: 20px;
  }

  form {
    padding: 25px 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn, .cancel-btn {
    width: 100%;
  }
}
</style>
