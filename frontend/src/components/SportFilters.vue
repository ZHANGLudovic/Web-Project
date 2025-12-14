<template>
    <div class="filters">
        <label v-for="sport in sports" :key="sport.value" class="filter-item">
            <input type="checkbox" :value="sport.value" :checked="selected.includes(sport.value)" @change="updateSelected" />
            {{ sport.label }}
        </label>
    </div>
</template>


<script>
export default {
    name: 'SportFilters',
    props: ['selected'],
    data() {
        return {
            sports: [
                { label: 'ALL', value: 'all' },
                { label: 'Football', value: 'Football' },
                { label: 'Basketball', value: 'Basketball' },
                { label: 'Tennis', value: 'Tennis' },
                { label: 'Volleyball', value: 'Volleyball' },
                { label: 'Badminton', value: 'Badminton' }
            ],
        };       
    },
    methods: {
        updateSelected(event) {
            const value = event.target.value;
            const newSelected = event.target.checked 
                ? [...this.selected, value]
                : this.selected.filter(s => s !== value);
            this.$emit('update:selected', newSelected);
        }
    }
};
</script>


<style scoped>
.filters {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    padding: 15px;
    background: #f0f0f0;
    border-radius: 8px;
    margin-bottom: 20px;
    align-items: center;
}


.filter-item {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    white-space: nowrap;
}

.filter-item input[type="checkbox"] {
    cursor: pointer;
}
</style>