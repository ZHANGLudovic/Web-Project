<template>
  <div class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Modifier le terrain</h2>
        <button @click="close" class="close-btn">&times;</button>
      </div>
      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="name">Nom du terrain:</label>
          <input v-model="form.name" type="text" id="name" required>
        </div>
        <div class="form-group">
          <label for="location">Adresse:</label>
          <input v-model="form.location" type="text" id="location" required>
        </div>
        <div class="form-group">
          <label for="ville">Ville:</label>
          <input v-model="form.ville" type="text" id="ville" required>
        </div>
        <div class="form-group">
          <label for="size">Taille (m²):</label>
          <input v-model="form.size" type="number" id="size" required>
        </div>
        <div class="form-group">
          <label for="type">Type de sport:</label>
          <select v-model="form.type" id="type" required>
            <option value="">Sélectionner un sport</option>
            <option v-for="sport in sports" :key="sport" :value="sport">
              {{ sport }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="horaires">Horaires:</label>
          <input v-model="form.horaires" type="text" id="horaires" placeholder="Ex: 09:00 - 18:00">
        </div>
        <div class="form-group">
          <label for="date">Date disponible:</label>
          <input v-model="form.date" type="date" id="date">
        </div>
        <div class="form-group">
          <label for="prix">Prix (€/heure):</label>
          <input v-model="form.prix" type="number" id="prix" step="0.01">
        </div>
        <div class="form-group">
          <label for="description">Description (max 500 caractères):</label>
          <textarea v-model="form.description" id="description" maxlength="500" rows="4"></textarea>
          <span class="char-count">{{ form.description.length }}/500</span>
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-btn">Enregistrer</button>
          <button type="button" @click="close" class="cancel-btn">Annuler</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditTerrainForm',
  props: {
    terrain: {
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
      sports: ['Football', 'Basketball', 'Tennis', 'Volleyball']
    };
  },
  watch: {
    terrain: {
      immediate: true,
      handler(newTerrain) {
        if (newTerrain) {
          this.form = {
            name: newTerrain.nom,
            location: newTerrain.adresse || '',
            ville: newTerrain.ville,
            size: newTerrain.taille || '',
            type: newTerrain.sport,
            horaires: newTerrain.horaires || '',
            date: newTerrain.date || '',
            prix: newTerrain.prix || '',
            description: newTerrain.description || ''
          };
        }
      }
    }
  },
  methods: {
    submit() {
      if (!this.form.type) {
        alert('Veuillez sélectionner un type de sport');
        return;
      }
      this.$emit('submit', this.form);
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
</style>
