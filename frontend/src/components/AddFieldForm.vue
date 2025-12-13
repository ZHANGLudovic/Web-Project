<template>
  <div class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Add a new field</h2>
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
          <button type="submit" class="submit-btn">Add</button>
          <button type="button" @click="close" class="cancel-btn">Cancel</button>
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
      preview: null
    };
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        this.preview = reader.result; // base64
        this.imageUrl = ''; // clear URL when file chosen
      };
      reader.readAsDataURL(file);
    },
    submit() {
      if (!this.form.type) {
        alert('Please select a sport type');
        return;
      }
      const payload = {
        name: this.form.name,
        type: this.form.type,
        location: this.form.location,
        ville: this.form.ville,
        size: this.form.size,
        horaires: this.form.horaires,
        date: this.form.date,
        prix: this.form.prix,
        description: this.form.description,
        image: this.preview || (this.imageUrl ? this.imageUrl.trim() : null)
      };
      this.$emit('submit', payload);
      this.form = { name: '', location: '', ville: '', size: '', type: '', horaires: '', date: '', prix: '', description: '' };
      this.preview = null;
      this.imageUrl = '';
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
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  padding: 0;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  background: linear-gradient(135deg, #2f80ed 0%, #1e5cb8 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: white;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.close-btn:hover {
  transform: rotate(90deg);
}

form {
  padding: 30px;
  max-height: 70vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #2f80ed;
  box-shadow: 0 0 0 3px rgba(47, 128, 237, 0.1);
}

.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: Arial, sans-serif;
  resize: vertical;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group textarea:focus {
  outline: none;
  border-color: #2f80ed;
  box-shadow: 0 0 0 3px rgba(47, 128, 237, 0.1);
}

.char-count {
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 6px;
  text-align: right;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.submit-btn, .cancel-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
}

.submit-btn:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background-color: #eeeeee;
  border-color: #ccc;
}

.preview img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  margin-top: 8px;
}

/* Scrollbar styling */
form::-webkit-scrollbar {
  width: 6px;
}

form::-webkit-scrollbar-track {
  background: #f1f1f1;
}

form::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

form::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
