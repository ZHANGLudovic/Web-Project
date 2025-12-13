<template>
  <button @click="addField" class="add-field-btn" title="Add a new field">
    <span class="btn-icon">+</span>
    <span class="btn-text">Add Field</span>
  </button>
</template>

<script>
export default {
  name: 'AddFieldButton',
  methods: {
    addField() {
      this.$emit('add-field');
    }
  }
}
</script>

<style scoped>
.add-field-btn {
  padding: 10px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-field-btn:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.add-field-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-weight: bold;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-text {
  display: inline;
}
</style>
