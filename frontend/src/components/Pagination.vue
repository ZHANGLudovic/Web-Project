<template>
  <div v-if="totalPages > 1" class="pagination">
    <button 
      @click="goToPage(1)" 
      :disabled="currentPage === 1"
      class="pagination-btn"
      title="First page"
    >
      «
    </button>
    
    <button 
      @click="goToPage(currentPage - 1)" 
      :disabled="currentPage === 1"
      class="pagination-btn"
      title="Previous page"
    >
      ‹
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      @click="goToPage(page)"
      :class="['pagination-btn', { active: page === currentPage }]"
    >
      {{ page }}
    </button>

    <button 
      @click="goToPage(currentPage + 1)" 
      :disabled="currentPage === totalPages"
      class="pagination-btn"
      title="Next page"
    >
      ›
    </button>

    <button 
      @click="goToPage(totalPages)" 
      :disabled="currentPage === totalPages"
      class="pagination-btn"
      title="Last page"
    >
      »
    </button>

    <div class="pagination-info">
      Page {{ currentPage }} of {{ totalPages }} ({{ totalItems }} fields)
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaginationComponent',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    }
  },
  computed: {
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);
      
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  },
  methods: {
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.$emit('page-change', page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 40px 0 20px;
  flex-wrap: wrap;
}

.pagination-btn {
  min-width: 40px;
  height: 40px;
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  background: var(--bg-white);
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  background-color: #f5f7ff;
  transform: translateY(-2px);
}

.pagination-btn.active {
  background: var(--primary-gradient);
  color: white;
  border-color: var(--primary-color);
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

.pagination-info {
  margin-left: 15px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .pagination {
    margin: 30px 0 15px;
    gap: 6px;
  }

  .pagination-btn {
    min-width: 36px;
    height: 36px;
    padding: 6px 10px;
    font-size: 13px;
  }

  .pagination-info {
    width: 100%;
    text-align: center;
    margin: 10px 0 0 0;
  }
}
</style>
