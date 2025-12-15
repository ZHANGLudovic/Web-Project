import { createApp } from 'vue';
import ToastNotification from '../components/Toast.vue'; // Updated import name

let toastInstance = null;

export default {
  install(app) {
    if (!toastInstance) {
      const toastContainer = document.createElement('div');
      document.body.appendChild(toastContainer);
      
      const toastApp = createApp(ToastNotification); // Updated component name
      toastInstance = toastApp.mount(toastContainer);
    }

    app.config.globalProperties.$toast = {
      error(message, title = 'Error') {
        toastInstance.show({ type: 'error', title, message });
      },
      success(message, title = 'Success') {
        toastInstance.show({ type: 'success', title, message, duration: 3000 });
      },
      warning(message, title = 'Warning') {
        toastInstance.show({ type: 'warning', title, message });
      },
      info(message, title = 'Info') {
        toastInstance.show({ type: 'info', title, message });
      }
    };
  }
};
