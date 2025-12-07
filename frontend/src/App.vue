<template>
  <div id="app">
  <HeaderBar />
  <div class="button-container">
    <AddTerrainButton @add-terrain="handleAddTerrain" />
  </div>
  <AddTerrainForm v-if="showForm" @close="showForm = false" @submit="submitTerrain" />
  <EditTerrainForm v-if="showEditForm" :terrain="terrainToEdit" @close="showEditForm = false" @submit="submitEditTerrain" />
  <router-view :key="terrainRefresh" :terrains="terrains" @update-terrains="updateTerrains" @edit-terrain="handleEditTerrain" />
  </div>
</template>


<script>
import HeaderBar from './components/HeaderBar.vue';
import AddTerrainButton from './components/AddTerrainButton.vue';
import AddTerrainForm from './components/AddTerrainForm.vue';
import EditTerrainForm from './components/EditTerrainForm.vue';

export default {
components: { HeaderBar, AddTerrainButton, AddTerrainForm, EditTerrainForm },
data() {
  return {
    showForm: false,
    showEditForm: false,
    terrains: [],
    terrainToEdit: null,
    terrainRefresh: 0
  };
},
methods: {
  handleAddTerrain() {
    this.showForm = true;
  },
  handleEditTerrain(terrain) {
    this.terrainToEdit = terrain;
    this.showEditForm = true;
  },
  submitTerrain(terrainData) {
    const newTerrain = {
      id: Date.now(),
      nom: terrainData.name,
      sport: terrainData.type,
      adresse: terrainData.location,
      ville: terrainData.ville,
      taille: terrainData.size,
      horaires: terrainData.horaires,
      date: terrainData.date,
      prix: terrainData.prix,
      description: terrainData.description
    };
    this.terrains.push(newTerrain);
    this.terrainRefresh++;
    console.log('Nouveau terrain:', newTerrain);
    this.showForm = false;
  },
  submitEditTerrain(terrainData) {
    const index = this.terrains.findIndex(t => t.id === this.terrainToEdit.id);
    if (index !== -1) {
      this.terrains[index] = {
        ...this.terrains[index],
        nom: terrainData.name,
        sport: terrainData.type,
        adresse: terrainData.location,
        ville: terrainData.ville,
        taille: terrainData.size,
        horaires: terrainData.horaires,
        date: terrainData.date,
        prix: terrainData.prix,
        description: terrainData.description
      };
    }
    this.$emit('update-terrains', this.terrains);
    this.terrainRefresh++;
    this.showEditForm = false;
  },
  updateTerrains(newTerrains) {
    this.terrains = newTerrains;
  }
},
};
</script>


<style>
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}

.button-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
</style>