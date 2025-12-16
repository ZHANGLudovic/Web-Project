<template>
  <div id="app">
  <HeaderBar />
  <div class="button-container">
    <AddFieldButton v-if="isAdmin" @add-field="handleAddField" />
  </div>
  <AddFieldForm v-if="showForm" @close="showForm = false" @submit="submitField" />
  <EditFieldForm v-if="showEditForm" :field="fieldToEdit" @close="showEditForm = false" @submit="submitEditField" />
  <router-view :key="fieldRefresh" :fields="fields" @update-fields="updateFields" @edit-field="handleEditField" />
  <AppFooter />
  </div>
</template>


<script>
import HeaderBar from './components/HeaderBar.vue';
import AddFieldButton from './components/AddFieldButton.vue';
import AddFieldForm from './components/AddFieldForm.vue';
import EditFieldForm from './components/EditFieldForm.vue';
import AppFooter from './components/Footer.vue';
import { eventBus } from './eventBus.js';

export default {
components: { HeaderBar, AddFieldButton, AddFieldForm, EditFieldForm, AppFooter },
data() {
  return {
    showForm: false,
    showEditForm: false,
    fields: [],
    fieldToEdit: null,
    fieldRefresh: 0,
    user: null
  };
},
computed: {
  isAdmin() {
    return this.user && this.user.role === 'admin';
  }
},
mounted() {
  // Check if user is stored in localStorage
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      this.user = JSON.parse(storedUser);
    } catch (e) {
      console.error('Error parsing stored user:', e);
      this.user = null;
    }
  }

  // Listen for login event
  eventBus.on('user-logged-in', (user) => {
    this.user = user;
  });

  // Listen for logout event
  eventBus.on('user-logged-out', () => {
    this.user = null;
  });
},
methods: {
  handleAddField() {
    this.showForm = true;
  },
  handleEditField(field) {
    this.fieldToEdit = field;
    this.showEditForm = true;
  },
  async submitField(fieldData) {
    try {
      const response = await fetch('http://localhost:3000/fields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nom: fieldData.name,
          sport: fieldData.type,
          adresse: fieldData.location,
          ville: fieldData.ville,
          taille: fieldData.size,
          horaires: fieldData.horaires,
          prix: fieldData.prix,
          description: fieldData.description,
          image_url: fieldData.image || null
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Field created:', result);
        // Refresh the page to show the new field
        this.fieldRefresh++;
        this.showForm = false;
      } else {
        const error = await response.json();
        alert('Error creating field: ' + error.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create field');
    }
  },
  submitEditField(fieldData) {
    const index = this.fields.findIndex(f => f.id === this.fieldToEdit.id);
    if (index !== -1) {
      this.fields[index] = {
        ...this.fields[index],
        nom: fieldData.name,
        sport: fieldData.type,
        adresse: fieldData.location,
        ville: fieldData.ville,
        taille: fieldData.size,
        horaires: fieldData.horaires,
        date: fieldData.date,
        prix: fieldData.prix,
        description: fieldData.description,
        image: fieldData.image ?? this.fields[index].image
      };
    }
    this.$emit('update-fields', this.fields);
    this.fieldRefresh++;
    this.showEditForm = false;
  },
  updateFields(newFields) {
    this.fields = newFields;
  }
},
};
</script>


<style>
/* Reset & Base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  color: #333;
  line-height: 1.6;
  min-height: 100vh;
}

/* CSS Variables for consistent theming */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --primary-color: #667eea;
  --primary-dark: #5568d3;
  --secondary-color: #764ba2;
  --success-color: #4CAF50;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
  --text-primary: #333;
  --text-secondary: #666;
  --text-light: #999;
  --bg-light: #f5f7fa;
  --bg-white: #ffffff;
  --border-color: #e0e0e0;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.2);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --transition: all 0.3s ease;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Container styles */
.button-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px 10px;
  width: 100%;
  animation: fadeInDown 0.6s ease;
}

/* Global Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; }
h5 { font-size: 1.1rem; }
h6 { font-size: 1rem; }

p {
  color: var(--text-secondary);
  line-height: 1.7;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition);
}

a:hover {
  color: var(--primary-dark);
}

/* Utility Classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mt-4 { margin-top: 2rem; }

.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 2rem; }

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Selection Styling */
::selection {
  background: rgba(102, 126, 234, 0.3);
  color: var(--text-primary);
}

/* Global Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Panel/Card Styles */
.panel-soft {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

/* Button Base Styles */
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  outline: none;
  transition: var(--transition);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Loading State */
.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Focus Styles */
input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Responsive Typography */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }

  h1 { font-size: 2rem; }
  h2 { font-size: 1.75rem; }
  h3 { font-size: 1.4rem; }
  h4 { font-size: 1.2rem; }

  .button-container {
    padding: 20px 15px 10px;
  }
}

@media (max-width: 480px) {
  html {
    font-size: 13px;
  }

  h1 { font-size: 1.75rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.25rem; }

  .button-container {
    padding: 15px 10px 8px;
  }
}

/* Print Styles */
@media print {
  body {
    background: white;
  }
  
  .no-print {
    display: none;
  }
}
</style>