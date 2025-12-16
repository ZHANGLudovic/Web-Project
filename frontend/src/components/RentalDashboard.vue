<template>
    <div v-if="field" class="rental-modal">
        <div class="modal-overlay" @click="$emit('close')"></div>
        <div class="modal-content">
            <button class="close-btn" @click="$emit('close')">×</button>
            
            <div class="rental-header">
                <h2>{{ field.nom }}</h2>
                <p class="location">{{ field.adresse }}, {{ field.ville }}</p>
                <p class="price">{{ field.prix }}€ per hour</p>
            </div>

            <div class="rental-body">
                <div class="date-picker">
                    <label for="rental-date">Select Date:</label>
                    <input 
                        v-model="selectedDate" 
                        type="date" 
                        id="rental-date"
                        :min="today"
                    />
                </div>

                <div class="time-slots">
                    <h3>Available Times</h3>
                    <div v-if="loadingSlots" class="loading-slots">
                        <p>Loading available times...</p>
                    </div>
                    <div v-else class="slots-grid">
                        <button 
                            v-for="slot in allTimeSlots" 
                            :key="slot"
                            @click="selectTimeSlot(slot)"
                            :disabled="isSlotReserved(slot)"
                            :class="getSlotClass(slot)"
                        >
                            {{ slot }}
                            <span v-if="isSlotReserved(slot)" class="reserved-icon">Locked</span>
                        </button>
                    </div>
                    <p v-if="!loadingSlots && availableSlots.length === 0" class="no-slots">
                        No available times for this date
                    </p>
                </div>

                <div v-if="selectedTimeSlots.length > 0" class="booking-summary">
                    <h3>Booking Summary</h3>
                    <div class="summary-item">
                        <span>Field:</span>
                        <strong>{{ field.nom }}</strong>
                    </div>
                    <div class="summary-item">
                        <span>Date:</span>
                        <strong>{{ formatDate(selectedDate) }}</strong>
                    </div>
                    <div class="summary-item">
                        <span>Time Range:</span>
                        <strong>{{ timeRange }}</strong>
                    </div>
                    <div class="summary-item">
                        <span>Duration:</span>
                        <strong>{{ totalDuration }} hour{{ totalDuration > 1 ? 's' : '' }}</strong>
                    </div>
                    <div class="summary-item">
                        <span>Selected Slots:</span>
                        <strong>{{ selectedTimeSlots.length }} slot(s)</strong>
                    </div>
                    <div class="summary-item total">
                        <span>Total Price:</span>
                        <strong>{{ totalPrice }}€</strong>
                    </div>
                </div>

                <div class="modal-actions">
                    <button @click="$emit('close')" class="btn-cancel">Cancel</button>
                    <button 
                        @click="confirmBooking" 
                        :disabled="selectedTimeSlots.length === 0"
                        class="btn-confirm"
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../eventBus.js';

export default {
    name: 'RentalDashboard',
    props: {
        field: { type: Object, required: true }
    },
    data() {
        return {
            selectedDate: new Date().toISOString().split('T')[0],
            selectedTimeSlots: [],
            reservedSlots: [],
            availableSlots: [],
            allTimeSlots: [],
            loadingSlots: false,
            today: new Date().toISOString().split('T')[0]
        };
    },
    computed: {
        totalPrice() {
            // Calculer en fonction de la durée totale, pas du nombre de créneaux
            if (this.selectedTimeSlots.length === 0) return 0;
            
            const sorted = [...this.selectedTimeSlots].sort();
            const startHour = parseInt(sorted[0].split(':')[0]);
            const lastSlot = sorted[sorted.length - 1];
            const endHour = parseInt(lastSlot.split(':')[0]) + 1;
            const totalHours = endHour - startHour;
            
            return this.field.prix * totalHours;
        },
        timeRange() {
            if (this.selectedTimeSlots.length === 0) return '';
            const sorted = [...this.selectedTimeSlots].sort();
            const start = sorted[0];
            const lastSlot = sorted[sorted.length - 1];
            const endHour = parseInt(lastSlot.split(':')[0]) + 1;
            const end = `${endHour.toString().padStart(2, '0')}:00`;
            return `${start} - ${end}`;
        },
        totalDuration() {
            if (this.selectedTimeSlots.length === 0) return 0;
            
            const sorted = [...this.selectedTimeSlots].sort();
            const startHour = parseInt(sorted[0].split(':')[0]);
            const lastSlot = sorted[sorted.length - 1];
            const endHour = parseInt(lastSlot.split(':')[0]) + 1;
            
            return endHour - startHour;
        }
    },
    mounted() {
        this.fetchAvailableSlots();
        // Rafraîchir les créneaux toutes les 10 secondes pour voir les changements en temps réel
        this.refreshInterval = setInterval(() => {
            this.fetchAvailableSlots();
        }, 10000);
    },
    beforeUnmount() {
        // Nettoyer l'intervalle quand le composant est détruit
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    },
    watch: {
        selectedDate() {
            this.selectedTimeSlots = [];
            this.fetchAvailableSlots();
        }
    },
    methods: {
        getSlotClass(slot) {
            const classes = ['time-slot'];
            if (this.selectedTimeSlots.includes(slot)) {
                classes.push('selected');
            }
            if (this.reservedSlots.includes(slot)) {
                classes.push('reserved');
            }
            return classes;
        },
        async fetchAvailableSlots() {
            this.loadingSlots = true;
            
            try {
                const url = `http://localhost:3000/fields/${this.field.id}/available-slots?date=${this.selectedDate}`;
                const response = await fetch(url);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Mise à jour simple et directe
                    this.reservedSlots = Array.isArray(data.reserved_slots) ? data.reserved_slots : [];
                    this.availableSlots = Array.isArray(data.available_slots) ? data.available_slots : [];
                    this.allTimeSlots = Array.isArray(data.all_slots) ? data.all_slots : [];
                    
                    console.log(`✅ Loaded ${this.allTimeSlots.length} slots, ${this.reservedSlots.length} reserved`);
                } else {
                    console.error('Failed to fetch slots');
                    this.generateDefaultSlots();
                }
            } catch (error) {
                console.error('Error:', error);
                this.generateDefaultSlots();
            } finally {
                this.loadingSlots = false;
            }
        },
        generateDefaultSlots() {
            // Fallback: générer les créneaux depuis les horaires du terrain
            const slots = [];
            const hours = this.field.horaires.split(' - ');
            if (hours.length === 2) {
                const [startStr, endStr] = hours;
                const start = parseInt(startStr.split(':')[0]);
                const end = parseInt(endStr.split(':')[0]);
                
                for (let i = start; i < end; i++) {
                    slots.push(`${i.toString().padStart(2, '0')}:00`);
                }
            }
            this.allTimeSlots = slots;
            this.availableSlots = slots;
            this.reservedSlots = [];
        },
        isSlotReserved(slot) {
            return Array.isArray(this.reservedSlots) && this.reservedSlots.includes(slot);
        },
        isSlotSelected(slot) {
            return Array.isArray(this.selectedTimeSlots) && this.selectedTimeSlots.includes(slot);
        },
        selectTimeSlot(slot) {
            if (this.isSlotReserved(slot)) return;
            
            const index = this.selectedTimeSlots.indexOf(slot);
            if (index > -1) {
                this.selectedTimeSlots.splice(index, 1);
            } else {
                this.selectedTimeSlots.push(slot);
            }
            // Trier les créneaux sélectionnés
            this.selectedTimeSlots.sort();
        },
        formatDate(dateStr) {
            const date = new Date(dateStr + 'T00:00:00');
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        },
        async confirmBooking() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                this.$toast.error('Please login to book a field', 'Authentication Required');
                this.$router.push('/login');
                return;
            }

            if (this.selectedTimeSlots.length === 0) {
                this.$toast.warning('Please select at least one time slot', 'No Time Selected');
                return;
            }

            try {
                const sorted = [...this.selectedTimeSlots].sort();
                const startTime = sorted[0];
                const lastSlot = sorted[sorted.length - 1];
                const endHour = parseInt(lastSlot.split(':')[0]) + 1;
                const endTime = `${endHour.toString().padStart(2, '0')}:00`;
                
                const response = await fetch('http://localhost:3000/reservations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: user.id,
                        field_id: this.field.id,
                        reservation_date: this.selectedDate,
                        start_time: startTime,
                        end_time: endTime,
                        total_price: this.totalPrice
                    })
                });

                if (response.ok) {
                    await response.json();
                    // Success: show confirmation message
                    this.$toast.success(
                        `Booking confirmed for ${this.field.nom} on ${this.formatDate(this.selectedDate)} from ${this.timeRange}. Total: €${this.totalPrice}`,
                        'Booking Confirmed!'
                    );
                    // Emit events to update parent and global state
                    this.$emit('close');
                    this.$emit('booking-confirmed');
                    eventBus.emit('booking-confirmed');
                } else {
                    const error = await response.json();
                    if (error.conflicting_slots) {
                        this.$toast.error(
                            `Time slots ${error.conflicting_slots.join(', ')} are already reserved`,
                            'Booking Conflict'
                        );
                        this.fetchAvailableSlots();
                    } else {
                        this.$toast.error(error.error || 'Unable to complete booking', 'Booking Failed');
                    }
                }
            } catch (error) {
                console.error('Error booking field:', error);
                this.$toast.error('Network error. Please check your connection', 'Connection Error');
            }
        }
    }
};
</script>

<style scoped>
.rental-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    position: relative;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #666;
    z-index: 10;
}

.close-btn:hover {
    color: #333;
}

.rental-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px 25px;
    border-radius: 12px 12px 0 0;
}

.rental-header h2 {
    margin: 0 0 10px 0;
    font-size: 28px;
}

.location {
    margin: 5px 0;
    font-size: 14px;
    opacity: 0.9;
}

.price {
    margin: 10px 0 0 0;
    font-size: 18px;
    font-weight: 600;
}

.rental-body {
    padding: 25px;
}

.date-picker {
    margin-bottom: 25px;
}

.date-picker label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
}

.date-picker input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
}

.date-picker input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.time-slots {
    margin-bottom: 25px;
}

.time-slots h3 {
    font-size: 16px;
    margin: 0 0 15px 0;
    color: #333;
}

.slots-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 10px;
}

.time-slot {
    padding: 12px 10px;
    border: 2px solid #ddd;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    color: #333;
    position: relative;
}

.time-slot:hover:not(:disabled) {
    border-color: #667eea;
    background-color: #f5f7ff;
}

.time-slot.selected {
    border-color: #667eea;
    background-color: #667eea;
    color: white;
}

.time-slot.reserved {
    background-color: #f0f0f0;
    color: #999;
    border-color: #ddd;
    cursor: not-allowed;
    opacity: 0.6;
}

.time-slot.reserved:hover {
    background-color: #f0f0f0;
    border-color: #ddd;
    transform: none;
}

.reserved-icon {
  position: absolute;
  top: 2px;
  right: 4px;
  font-size: 8px;
  font-weight: 600;
  text-transform: uppercase;
}

.time-slot:disabled {
    cursor: not-allowed;
}

.loading-slots {
    text-align: center;
    padding: 20px;
    color: #666;
}

.booking-summary {
    background-color: #f9f9f9;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 25px;
}

.booking-summary h3 {
    margin: 0 0 15px 0;
    font-size: 16px;
    color: #333;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 14px;
}

.summary-item span {
    color: #666;
}

.summary-item strong {
    color: #333;
}

.duration-select {
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
}

.summary-item.total {
    border-top: 2px solid #ddd;
    padding-top: 12px;
    margin-top: 12px;
    font-size: 16px;
    font-weight: 600;
}

.summary-item.total strong {
    color: #667eea;
}

.modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-cancel {
    background-color: #e0e0e0;
    color: #333;
}

.btn-cancel:hover {
    background-color: #d0d0d0;
}

.btn-confirm {
    background-color: #667eea;
    color: white;
}

.btn-confirm:hover:not(:disabled) {
    background-color: #5568d3;
    transform: translateY(-2px);
}

.btn-confirm:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
