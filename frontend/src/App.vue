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
  submitField(fieldData) {
    const newField = {
      id: Date.now(),
      nom: fieldData.name,
      sport: fieldData.type,
      adresse: fieldData.location,
      ville: fieldData.ville,
      taille: fieldData.size,
      horaires: fieldData.horaires,
      date: fieldData.date,
      prix: fieldData.prix,
      description: fieldData.description,
      image: fieldData.image || null
    };
    this.fields.push(newField);
    this.fieldRefresh++;
    this.showForm = false;
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
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
  color: #333;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.button-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  width: 100%;
  animation: fadeIn 0.5s ease;
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

/* Responsive design */
@media (max-width: 768px) {
  .button-container {
    padding: 20px 15px;
  }
}
</style>