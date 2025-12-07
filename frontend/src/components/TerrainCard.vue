<template>
  <div class="terrain-card">
    <div class="terrain-header">
      <h3>{{ terrain.nom }}</h3>
      <div class="action-buttons-top">
        <button class="btn-modifier" @click="handleModifier" title="Modifier">✏️</button>
        <button class="btn-supprimer" @click="handleSupprimer" title="Supprimer">🗑️</button>
      </div>
    </div>
    <div class="terrain-info">
      <p><strong>📍 Ville:</strong> {{ terrain.ville }}</p>
      <span class="sport-badge">⚽ {{ terrain.sport }}</span>
    </div>
    <div class="terrain-footer">
      <button class="btn-details" @click="handleDetails">Détails</button>
      <button 
        v-if="!isReserved" 
        class="btn-louer" 
        @click="handleLouer"
      >
        Louer
      </button>
      <button 
        v-else 
        class="btn-annuler" 
        @click="handleAnnulerReservation"
      >
        Annuler la réservation
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TerrainCard',
  props: {
    terrain: {
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
      this.$emit('details', this.terrain.id);
    },
    handleModifier() {
      this.$emit('modifier', this.terrain.id);
    },
    handleSupprimer() {
      if (confirm(`Êtes-vous sûr de vouloir supprimer "${this.terrain.nom}" ?`)) {
        this.$emit('supprimer', this.terrain.id);
      }
    },
    handleLouer() {
      this.isReserved = true;
      this.$emit('louer', this.terrain.id);
    },
    handleAnnulerReservation() {
      if (confirm('Êtes-vous sûr de vouloir annuler la réservation ?')) {
        this.isReserved = false;
        this.$emit('annuler-reservation', this.terrain.id);
      }
    }
  }
}
</script>

<style scoped>
.terrain-card {
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

.terrain-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.terrain-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.terrain-header h3 {
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

.terrain-info {
  margin-bottom: 16px;
  flex: 1;
}

.terrain-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #555;
}

.terrain-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-details, .btn-modifier, .btn-supprimer, .btn-louer, .btn-annuler {
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

.btn-louer {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
  color: white;
}

.btn-louer:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
}

.btn-annuler {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  color: white;
}

.btn-annuler:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 152, 0, 0.3);
}

.btn-modifier {
  background-color: #4caf50;
  color: white;
  padding: 4px 8px;
  font-size: 14px;
}

.btn-modifier:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

.btn-supprimer {
  background-color: #f44336;
  color: white;
  padding: 4px 8px;
  font-size: 14px;
  margin-left: 6px;
}

.btn-supprimer:hover {
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