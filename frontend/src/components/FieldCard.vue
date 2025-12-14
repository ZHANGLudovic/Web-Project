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
        <button @click="$emit('details', field.id)">Details</button>
        <button v-if="isAdmin" @click="$emit('edit', field.id)">Edit</button>
        <button v-if="isAdmin" @click="$emit('delete', field.id)">Delete</button>
        <button @click="$emit('rent', field.id)">Rent</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FieldCard',
  props: {
    field: { type: Object, required: true },
    isAdmin: { type: Boolean, default: false }
  },
  computed: {
    displayImage() {
      if (this.field.image) return this.field.image;
      const sport = (this.field.sport || '').toLowerCase();
      if (sport.includes('football')) return new URL('../Image/Foot.webp', import.meta.url).href;
      if (sport.includes('basket')) return new URL('../Image/Baskette.jpg', import.meta.url).href;
      if (sport.includes('tennis')) return new URL('../Image/Tennis.jpg', import.meta.url).href;
      // use existing Foot.webp as a safe fallback (default-field.jpg was missing)
      return new URL('../Image/Foot.webp', import.meta.url).href;
    }
  }
};
</script>

<style scoped>
.field-card {
  display: flex;
  gap: 16px;
  background: white;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #eee;
  margin-bottom: 16px;
  align-items: center;
}
.thumb {
  width: 120px;
  height: 80px;
  flex: 0 0 120px;
  overflow: hidden;
  border-radius: 8px;
  background: #f3f3f3;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.info {
  flex: 1;
}
.meta { color: #666; font-size: 13px; margin-bottom: 6px; }
.desc { color: #444; font-size: 14px; margin-bottom: 10px; }
.actions button { margin-right: 8px; }
</style>