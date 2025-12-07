<template>
    <div class="container">
        <div class="filters-section">
            <SportFilters :selected="selectedSports" @update:selected="selectedSports = $event" />
            <SearchBar @search="handleSearch" />
        </div>

        <div>
            <TerrainCard
            v-for="t in filteredTerrains"
            :key="t.id"
            :terrain="t"
            @details="handleDetails"
            @modifier="handleModifier"
            @supprimer="handleSupprimer"
            @louer="handleLouer"
            @annuler-reservation="handleAnnulerReservation"
            />
        </div>
        <TerrainDetails v-if="showDetails" :terrain="terrainDetails" @close="showDetails = false" />
    </div>
</template>


<script>
import SearchBar from '../components/SearchBar.vue';
import SportFilters from '../components/SportFilters.vue';
import TerrainCard from '../components/TerrainCard.vue';
import TerrainDetails from '../components/TerrainDetails.vue';

export default {
    name: 'HomePage',
    components: { SearchBar, SportFilters, TerrainCard, TerrainDetails },


    props: ['terrains'],


    data() {
        return {
        selectedSports: ['all'],
        showDetails: false,
        terrainDetails: null,
        searchQuery: '',
        defaultTerrains: [
            { id: 1, nom: 'Terrain Central', sport: 'Football', adresse: '123 Rue de Paris', ville: 'Paris', taille: 5000, horaires: '09:00 - 18:00', date: '2024-12-31', prix: 25, description: 'Terrain de football professionnel avec éclairage nocturne. Excellent état du gazon.' },
            { id: 2, nom: 'Salle 32', sport: 'Basketball', adresse: '456 Avenue Lyon', ville: 'Lyon', taille: 2500, horaires: '08:00 - 20:00', date: '2024-12-31', prix: 30, description: 'Salle climatisée avec équipement moderne pour basketball.' },
            { id: 3, nom: 'Court Bleu', sport: 'Tennis', adresse: '789 Route Tennis', ville: 'Marseille', taille: 800, horaires: '07:00 - 19:00', date: '2024-12-31', prix: 20, description: 'Court de tennis avec surface en dur bleu.' },
        ],
        };
    },


    computed: {
    allTerrains() {
        return [...this.defaultTerrains, ...this.terrains];
    },
    filteredTerrains() {
        let result = this.allTerrains;

        // Filtrer par sport
        if (!this.selectedSports.includes('all')) {
            result = result.filter(t => this.selectedSports.includes(t.sport));
        }

        // Filtrer par recherche
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(t => 
                t.nom.toLowerCase().includes(query) || 
                t.ville.toLowerCase().includes(query)
            );
        }

        return result;
    },
    },
    
    methods: {
        handleSearch(query) {
            this.searchQuery = query;
        },
        handleDetails(id) {
            const terrain = this.allTerrains.find(t => t.id === id);
            if (terrain) {
                this.terrainDetails = terrain;
                this.showDetails = true;
            }
        },
        handleModifier(id) {
            const terrain = this.allTerrains.find(t => t.id === id);
            if (terrain) {
                this.$emit('edit-terrain', terrain);
            }
        },
        handleSupprimer(id) {
            this.defaultTerrains = this.defaultTerrains.filter(t => t.id !== id);
            this.$emit('update-terrains', this.terrains.filter(t => t.id !== id));
        },
        handleLouer(id) {
            const terrain = this.allTerrains.find(t => t.id === id);
            if (terrain) {
                console.log(`Terrain "${terrain.nom}" loué avec succès!`);
                alert(`Vous avez loué "${terrain.nom}" avec succès!`);
            }
        },
        handleAnnulerReservation(id) {
            const terrain = this.allTerrains.find(t => t.id === id);
            if (terrain) {
                console.log(`Réservation de "${terrain.nom}" annulée`);
                alert(`La réservation de "${terrain.nom}" a été annulée.`);
            }
        }
    }
};
</script>


<style scoped>
.container {
    max-width: 900px;
    margin: auto;
    padding: 30px 20px;
}

.filters-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 30px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    animation: slideInDown 0.4s ease;
}

@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>