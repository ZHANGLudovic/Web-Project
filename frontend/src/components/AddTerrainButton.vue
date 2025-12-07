<template>
  <button @click="addTerrain" class="add-terrain-btn">
    <span class="btn-icon">+</span>
    <span class="btn-text">Ajouter un terrain</span>
  </button>
</template>

<script>
export default {
  name: 'AddTerrainButton',
  methods: {
    addTerrain() {
      this.$emit('add-terrain');
    }
  }
}
</script>

<style scoped>
.add-terrain-btn {
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.add-terrain-btn:hover {
  background-color: #45a049;
}

.btn-icon {
  font-weight: bold;
  font-size: 18px;
}

.btn-text {
  display: inline;
}
</style>
