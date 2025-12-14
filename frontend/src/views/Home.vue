<template>
    <div class="container">
        <!-- use translucent panel so the background shows through -->
        <div class="filters-section panel-soft">
            <SportFilters :selected="selectedSports" @update:selected="selectedSports = $event" />
            <SearchBar @search="handleSearch" />
        </div>

        <div>
            <FieldCard
            v-for="f in filteredFields"
            :key="f.id"
            :field="f"
            :is-admin="isAdmin"
            @details="handleDetails"
            @edit="handleEdit"
            @delete="handleDelete"
            @rent="handleRent"
            @cancel-reservation="handleCancelReservation"
            />
        </div>
        <FieldDetails v-if="showDetails" :field="fieldDetails" @close="showDetails = false" />
    </div>
</template>


<script>
import SearchBar from '../components/SearchBar.vue';
import SportFilters from '../components/SportFilters.vue';
import FieldCard from '../components/FieldCard.vue';
import FieldDetails from '../components/FieldDetails.vue';

export default {
    name: 'HomePage',
    components: { SearchBar, SportFilters, FieldCard, FieldDetails },


    props: ['fields'],


    data() {
        return {
        selectedSports: ['all'],
        showDetails: false,
        fieldDetails: null,
        searchQuery: '',
        defaultFields: [
            { id: 1, nom: 'Central Field', sport: 'Football', adresse: '123 Rue de Paris', ville: 'Paris', taille: 5000, horaires: '09:00 - 18:00', date: '2024-12-31', prix: 25, description: 'Professional football field with night lighting. Excellent grass condition.', image: new URL('../Image/Foot.webp', import.meta.url).href },
            { id: 2, nom: 'Hall 32', sport: 'Basketball', adresse: '456 Avenue Lyon', ville: 'Lyon', taille: 2500, horaires: '08:00 - 20:00', date: '2024-12-31', prix: 30, description: 'Air-conditioned hall with modern equipment for basketball.', image: new URL('../Image/Baskette.jpg', import.meta.url).href },
            { id: 3, nom: 'Blue Court', sport: 'Tennis', adresse: '789 Route Tennis', ville: 'Marseille', taille: 800, horaires: '07:00 - 19:00', date: '2024-12-31', prix: 20, description: 'Tennis court with hard blue surface.', image: new URL('../Image/Tennis.jpg', import.meta.url).href },
        ],
        };
    },


    computed: {
    isAdmin() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                return user && user.role === 'admin';
            } catch (e) {
                return false;
            }
        }
        return false;
    },
    allFields() {
        return [...this.defaultFields, ...this.fields];
    },
    filteredFields() {
        let result = this.allFields;

        
        if (!this.selectedSports.includes('all')) {
            result = result.filter(f => this.selectedSports.includes(f.sport));
        }

        
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(f => 
                f.nom.toLowerCase().includes(query) || 
                f.ville.toLowerCase().includes(query)
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
            const field = this.allFields.find(f => f.id === id);
            if (field) {
                this.fieldDetails = field;
                this.showDetails = true;
            }
        },
        handleEdit(id) {
            const field = this.allFields.find(f => f.id === id);
            if (field) {
                this.$emit('edit-field', field);
            }
        },
        handleDelete(id) {
            this.defaultFields = this.defaultFields.filter(f => f.id !== id);
            this.$emit('update-fields', this.fields.filter(f => f.id !== id));
        },
        handleRent(id) {
            const field = this.allFields.find(f => f.id === id);
            if (field) {
                console.log(`Field "${field.nom}" rented successfully!`);
                alert(`You have successfully rented "${field.nom}"!`);
            }
        },
        handleCancelReservation(id) {
            const field = this.allFields.find(f => f.id === id);
            if (field) {
                console.log(`Reservation for "${field.nom}" cancelled`);
                alert(`The reservation for "${field.nom}" has been cancelled.`);
            }
        }
    }
};
</script>


<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
    animation: fadeIn 0.5s ease;
}

/* slightly adjust filters-section visuals to work with panel-soft */
.filters-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 30px;
    /* background/padding now comes from .panel-soft */
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #eee;
    animation: slideInDown 0.4s ease;
    flex-wrap: wrap;
}

/* Cards container */
.container > div:not(.filters-section) {
    animation: fadeIn 0.5s ease;
}

/* Individual field cards will animate in staggered */
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
@media (max-width: 1024px) {
    .container {
        padding: 20px 15px;
    }

    .filters-section {
        padding: 20px;
        gap: 15px;
    }
}

@media (max-width: 768px) {
    .container {
        padding: 15px 10px;
    }

    .filters-section {
        flex-direction: column;
        padding: 15px;
        gap: 15px;
    }

    .filters-section > * {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 10px 5px;
    }

    .filters-section {
        padding: 12px;
        margin-bottom: 20px;
    }
}
</style>