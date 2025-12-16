<template>
  <button @click="$emit('add-field')" class="add-field-btn">
    <span class="btn-icon">+</span>
    <span class="btn-text">Add New Field</span>
  </button>
</template>

<script>
export default {
  name: 'AddFieldButton'
};
</script>

<style scoped>
.add-field-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
}

.add-field-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
}

.add-field-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
}

.btn-icon {
  font-size: 24px;
  font-weight: 300;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.add-field-btn:hover .btn-icon {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.btn-text {
  font-size: 15px;
}

@media (max-width: 768px) {
  .add-field-btn {
    padding: 12px 24px;
    font-size: 15px;
  }

  .btn-icon {
    width: 24px;
    height: 24px;
    font-size: 20px;
  }

  .btn-text {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .add-field-btn {
    width: 100%;
    justify-content: center;
    padding: 14px 20px;
  }
}
</style>
