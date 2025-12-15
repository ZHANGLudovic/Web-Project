<template>
  <transition name="toast">
    <div v-if="visible" :class="['toast', type]">
      <div class="toast-icon">{{ icon }}</div>
      <div class="toast-content">
        <div class="toast-title">{{ title }}</div>
        <div class="toast-message">{{ message }}</div>
      </div>
      <button @click="close" class="toast-close">✕</button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ToastNotification', // Changed to multi-word
  data() {
    return {
      visible: false,
      type: 'error',
      title: '',
      message: '',
      timeout: null
    };
  },
  computed: {
    icon() {
      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      };
      return icons[this.type] || icons.info;
    }
  },
  methods: {
    show({ type = 'error', title = '', message = '', duration = 4000 }) {
      this.type = type;
      this.title = title;
      this.message = message;
      this.visible = true;

      if (this.timeout) clearTimeout(this.timeout);
      
      if (duration > 0) {
        this.timeout = setTimeout(() => {
          this.close();
        }, duration);
      }
    },
    close() {
      this.visible = false;
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
    }
  }
};
</script>

<style scoped>
.toast {
  position: fixed;
  top: 80px;
  right: 20px;
  min-width: 300px;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  gap: 12px;
  align-items: flex-start;
  z-index: 10000;
  border-left: 4px solid;
}

.toast.error {
  border-left-color: #dc3545;
}

.toast.success {
  border-left-color: #4CAF50;
}

.toast.warning {
  border-left-color: #ffc107;
}

.toast.info {
  border-left-color: #667eea;
}

.toast-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  flex-shrink: 0;
}

.toast.error .toast-icon {
  background: #fee;
  color: #dc3545;
}

.toast.success .toast-icon {
  background: #d4edda;
  color: #4CAF50;
}

.toast.warning .toast-icon {
  background: #fff3cd;
  color: #ffc107;
}

.toast.info .toast-icon {
  background: #e7f0ff;
  color: #667eea;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.toast-message {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: #999;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.toast-close:hover {
  background: #f0f0f0;
  color: #333;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(400px);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(400px);
  opacity: 0;
}

@media (max-width: 768px) {
  .toast {
    top: 70px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
}
</style>
