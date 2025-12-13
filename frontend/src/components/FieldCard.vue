<template>
  <div class="field-card">
    <div class="field-header">
      <h3>{{ field.nom }}</h3>
      <div class="action-buttons-top">
        <button class="btn-edit" @click="handleEdit" title="Edit">Edit</button>
        <button class="btn-delete" @click="handleDelete" title="Delete">Delete</button>
      </div>
    </div>
    <div class="field-info">
      <p><strong>📍 City:</strong> {{ field.ville }}</p>
      <span class="sport-badge"> {{ field.sport }}</span>
    </div>
    <div class="field-footer">
      <button class="btn-details" @click="handleDetails">Details</button>
      <button 
        v-if="!isReserved" 
        class="btn-rent" 
        @click="handleRent"
      >
        Rent
      </button>
      <button 
        v-else 
        class="btn-cancel" 
        @click="handleCancelReservation"
      >
        Cancel Reservation
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FieldCard',
  props: {
    field: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isReserved: false
    };
  },
  methods: {
    handleDetails() {
      this.$emit('details', this.field.id);
    },
    handleEdit() {
      this.$emit('edit', this.field.id);
    },
    handleDelete() {
      if (confirm(`Are you sure you want to delete "${this.field.nom}" ?`)) {
        this.$emit('delete', this.field.id);
      }
    },
    handleRent() {
      this.isReserved = true;
      this.$emit('rent', this.field.id);
    },
    handleCancelReservation() {
      if (confirm('Are you sure you want to cancel the reservation?')) {
        this.isReserved = false;
        this.$emit('cancel-reservation', this.field.id);
      }
    }
  }
}
</script>

<style scoped>
.field-card {
  border: none;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  animation: fadeIn 0.3s ease;
}

.field-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.field-header h3 {
  margin: 0;
  font-size: 18px;
  flex: 1;
  color: #2c3e50;
}

.action-buttons-top {
  display: flex;
  gap: 6px;
}

.sport-badge {
  display: inline-block;
  background: linear-gradient(135deg, #2f80ed 0%, #1e5cb8 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  margin-top: 8px;
  font-weight: 600;
}

.field-info {
  margin-bottom: 16px;
  flex: 1;
}

.field-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #555;
}

.field-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-details, .btn-edit, .btn-delete, .btn-rent, .btn-cancel {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-details {
  background: linear-gradient(135deg, #2f80ed 0%, #1e5cb8 100%);
  color: white;
}

.btn-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(47, 128, 237, 0.3);
}

.btn-rent {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
  color: white;
}

.btn-rent:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
}

.btn-cancel {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  color: white;
}

.btn-cancel:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 152, 0, 0.3);
}

.btn-edit {
  background-color: #4caf50;
  color: white;
  padding: 4px 8px;
  font-size: 14px;
}

.btn-edit:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

.btn-delete {
  background-color: #f44336;
  color: white;
  padding: 4px 8px;
  font-size: 14px;
  margin-left: 6px;
}

.btn-delete:hover {
  background-color: #da190b;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>