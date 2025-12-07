<template>
  <div class="search-container">
    <input 
      v-model="searchQuery" 
      type="text" 
      placeholder="Rechercher..."
      class="search-input"
      @input="handleSearch"
    />
    <span v-if="searchQuery" class="clear-btn" @click="clearSearch">✕</span>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      searchQuery: ''
    };
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.searchQuery);
    },
    clearSearch() {
      this.searchQuery = '';
      this.$emit('search', '');
    }
  }
}
</script>

<style scoped>
.search-container {
  position: relative;
  width: 200px;
}

.search-input {
  width: 100%;
  padding: 8px 30px 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}

.clear-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #999;
  font-size: 16px;
  transition: color 0.3s ease;
}

.clear-btn:hover {
  color: #333;
}
</style>
