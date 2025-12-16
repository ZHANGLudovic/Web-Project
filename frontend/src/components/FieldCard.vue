<template>
  <div class="field-card">
    <div class="thumb">
      <img :src="displayImage" :alt="field.nom" />
    </div>
    <div class="info">
      <h3>{{ field.nom }}</h3>
      <p class="meta">{{ field.sport }} · {{ field.ville }} · {{ field.prix }}€</p>
      <p class="desc">{{ field.description }}</p>
      <div class="actions">
        <button @click="$emit('details', field.id)" class="btn-details">Details</button>
        <button @click="$emit('rent', field.id)" class="btn-rent">Rent</button>
        <button v-if="isAdmin" @click="$emit('edit', field.id)" class="btn-edit">Edit</button>
        <button v-if="isAdmin" @click="$emit('delete', field.id)" class="btn-delete"> Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FieldCard',
  props: {
    field: { type: Object, required: true }
  },
  computed: {
    isAdmin() {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr || userStr === 'null' || userStr === 'undefined') {
          return false;
        }
        const user = JSON.parse(userStr);
        return user && user.role === 'admin';
      } catch (e) {
        return false;
      }
    },
    displayImage() {
      if (!this.field.image_url) {
        return new URL('../Image/Foot.webp', import.meta.url).href;
      }

      const imageName = this.field.image_url.split('/').pop();
      
      const imageMap = {
        'Foot.webp': new URL('../Image/Foot.webp', import.meta.url).href,
        'Football2.jpg': new URL('../Image/Football2.jpg', import.meta.url).href,
        'Football3.jpg': new URL('../Image/Football3.jpg', import.meta.url).href,
        'Baskette.jpg': new URL('../Image/Baskette.jpg', import.meta.url).href,
        'Basket2.jpg': new URL('../Image/Basket2.jpg', import.meta.url).href,
        'Basket3.jpg': new URL('../Image/Basket3.jpg', import.meta.url).href,
        'Badminton.jpg': new URL('../Image/Badminton.jpg', import.meta.url).href,
        'Badminton2.jpg': new URL('../Image/Badminton2.jpg', import.meta.url).href,
        'Tennis.jpg': new URL('../Image/Tennis.jpg', import.meta.url).href,
        'Tennis2.jpg': new URL('../Image/Tennis2.jpg', import.meta.url).href,
        'Tennis3.jpg': new URL('../Image/Tennis3.jpg', import.meta.url).href,
        'Volley.webp': new URL('../Image/Volley.webp', import.meta.url).href,
        'Volley2.jpg': new URL('../Image/Volley2.jpg', import.meta.url).href
      };

      return imageMap[imageName] || new URL('../Image/Foot.webp', import.meta.url).href;
    }
  }
};
</script>

<style scoped>
.field-card {
  display: flex;
  gap: 20px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  margin-bottom: 20px;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.field-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.thumb {
  width: 140px;
  height: 100px;
  flex: 0 0 140px;
  overflow: hidden;
  border-radius: 10px;
  background: #f5f5f5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.field-card:hover .thumb img {
  transform: scale(1.05);
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.3px;
}

.meta { 
  color: #666; 
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.desc { 
  color: #555; 
  font-size: 14px;
  line-height: 1.5;
  margin: 4px 0;
}

.actions { 
  display: flex;
  gap: 10px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.actions button { 
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.3px;
}

.actions button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.btn-details {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 2px solid transparent;
}

.btn-details:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

.btn-rent {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: 2px solid transparent;
}

.btn-rent:hover {
  background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transform: translateY(-2px);
}

.btn-edit {
  background: linear-gradient(135deg, #0099ff 0%, #0080cc 100%);
  color: white;
  border: 2px solid transparent;
  position: relative;
  font-weight: 700;
}

.btn-edit::before {
  content: "✏️";
  margin-right: 6px;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #0088dd 0%, #0070bb 100%);
  box-shadow: 0 6px 16px rgba(0, 153, 255, 0.4);
  transform: translateY(-3px);
}

.btn-edit:active {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 153, 255, 0.3);
}

.btn-delete {
  background: linear-gradient(135deg, #ff4757 0%, #ee5a6f 100%);
  color: white;
  border: 2px solid transparent;
  position: relative;
  font-weight: 700;
}

.btn-delete::before {
  content: "🗑️";
  margin-right: 6px;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #ff3838 0%, #e63c4e 100%);
  box-shadow: 0 6px 16px rgba(255, 71, 87, 0.4);
  transform: translateY(-3px);
}

.btn-delete:active {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(255, 71, 87, 0.3);
}

@media (max-width: 768px) {
  .field-card {
    flex-direction: column;
    gap: 16px;
  }

  .thumb {
    width: 100%;
    height: 180px;
    flex: none;
  }

  .actions {
    width: 100%;
    justify-content: space-between;
  }

  .actions button {
    flex: 1;
    justify-content: center;
    min-width: 0;
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>