<template>
  <div class="sport-filters">
    <h3 class="filter-title">Filter by Sport</h3>
    <div class="filter-buttons">
      <button
        v-for="sport in sports"
        :key="sport.value"
        @click="toggleSport(sport.value)"
        :class="['filter-btn', { active: isSelected(sport.value) }]"
      >
        <span class="sport-icon">{{ sport.icon }}</span>
        <span class="sport-name">{{ sport.label }}</span>
        <span v-if="isSelected(sport.value)" class="check-icon">✓</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SportFilters',
  props: {
    selected: {
      type: Array,
      default: () => ['all']
    }
  },
  data() {
    return {
      sports: [
        { value: 'all', label: 'All Sports', icon: '🏆' },
        { value: 'Football', label: 'Football', icon: '⚽' },
        { value: 'Basketball', label: 'Basketball', icon: '🏀' },
        { value: 'Tennis', label: 'Tennis', icon: '🎾' },
        { value: 'Volleyball', label: 'Volleyball', icon: '🏐' },
        { value: 'Badminton', label: 'Badminton', icon: '🏸' }
      ]
    };
  },
  methods: {
    toggleSport(value) {
      let newSelected = [...this.selected];
      
      if (value === 'all') {
        newSelected = ['all'];
      } else {
        newSelected = newSelected.filter(s => s !== 'all');
        
        if (newSelected.includes(value)) {
          newSelected = newSelected.filter(s => s !== value);
          if (newSelected.length === 0) {
            newSelected = ['all'];
          }
        } else {
          newSelected.push(value);
        }
      }
      
      this.$emit('update:selected', newSelected);
    },
    isSelected(value) {
      return this.selected.includes(value);
    }
  }
};
</script>

<style scoped>
.sport-filters {
  flex: 1;
  min-width: 300px;
}

.filter-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 700;
  color: #333;
  letter-spacing: -0.3px;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #555;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-btn:hover {
  border-color: #667eea;
  background-color: #f5f7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.15);
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.filter-btn.active:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.sport-icon {
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sport-name {
  font-size: 14px;
  white-space: nowrap;
}

.check-icon {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: white;
  color: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  animation: popIn 0.3s ease;
}

@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .sport-filters {
    width: 100%;
    min-width: auto;
  }

  .filter-title {
    font-size: 15px;
    margin-bottom: 12px;
  }

  .filter-buttons {
    gap: 8px;
  }

  .filter-btn {
    padding: 8px 14px;
    font-size: 13px;
  }

  .sport-icon {
    font-size: 16px;
  }

  .sport-name {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .filter-buttons {
    gap: 6px;
  }

  .filter-btn {
    padding: 7px 12px;
    font-size: 12px;
  }

  .sport-icon {
    font-size: 14px;
  }

  .sport-name {
    display: none;
  }

  .check-icon {
    width: 16px;
    height: 16px;
    font-size: 10px;
  }
}
</style>