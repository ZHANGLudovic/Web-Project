<template>
    <div v-if="field" class="rental-modal">
        <div class="modal-overlay" @click="$emit('close')"></div>
        <div class="modal-content">
            <button class="close-btn" @click="$emit('close')">✕</button>
            
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
                    <div class="slots-grid">
                        <button 
                            v-for="slot in availableSlots" 
                            :key="slot"
                            @click="selectTimeSlot(slot)"
                            :class="['time-slot', { selected: selectedTime === slot }]"
                        >
                            {{ slot }}
                        </button>
                    </div>
                    <p v-if="availableSlots.length === 0" class="no-slots">
                        No available times for this date
                    </p>
                </div>

                <div v-if="selectedTime" class="booking-summary">
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
                        <span>Time:</span>
                        <strong>{{ selectedTime }}</strong>
                    </div>
                    <div class="summary-item">
                        <span>Duration:</span>
                        <select v-model.number="duration" class="duration-select">
                            <option v-for="d in [1, 2, 3, 4, 5]" :key="d" :value="d">
                                {{ d }} hour{{ d > 1 ? 's' : '' }}
                            </option>
                        </select>
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
                        :disabled="!selectedTime"
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
import api from '../api.js';

export default {
    name: 'RentalDashboard',
    props: {
        field: { type: Object, required: true }
    },
    data() {
        return {
            selectedDate: new Date().toISOString().split('T')[0],
            selectedTime: null,
            duration: 1,
            reservedSlots: [],
            today: new Date().toISOString().split('T')[0]
        };
    },
    computed: {
        availableSlots() {
            const slots = this.generateTimeSlots();
            return slots.filter(slot => !this.reservedSlots.includes(slot));
        },
        totalPrice() {
            return this.field.prix * this.duration;
        }
    },
    mounted() {
        this.fetchReservations();
    },
    watch: {
        selectedDate() {
            this.selectedTime = null;
            this.fetchReservations();
        }
    },
    methods: {
        generateTimeSlots() {
            const slots = [];
            const hours = this.field.horaires.split(' - ');
            if (hours.length !== 2) return slots;
            
            const [startStr, endStr] = hours;
            const start = parseInt(startStr.split(':')[0]);
            const end = parseInt(endStr.split(':')[0]);
            
            for (let i = start; i < end; i++) {
                const timeStr = `${String(i).padStart(2, '0')}:00`;
                slots.push(timeStr);
            }
            return slots;
        },
        async fetchReservations() {
            try {
                const reservations = await api.users.getReservations(1);
                this.reservedSlots = (reservations || [])
                    .filter(r => r.reservation_date === this.selectedDate && r.field_id === this.field.id)
                    .map(r => r.start_time);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        },
        selectTimeSlot(slot) {
            this.selectedTime = slot;
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
                alert('Please login to book a field');
                this.$router.push('/login');
                return;
            }

            try {
                const endHour = parseInt(this.selectedTime) + this.duration;
                const endTime = `${String(endHour).padStart(2, '0')}:00`;
                
                await api.users.createReservation(user.id, {
                    field_id: this.field.id,
                    reservation_date: this.selectedDate,
                    start_time: this.selectedTime,
                    end_time: endTime,
                    total_price: this.totalPrice
                });

                alert(`Successfully booked ${this.field.nom} for ${this.formatDate(this.selectedDate)} at ${this.selectedTime}!`);
                this.$emit('close');
                this.$emit('booking-confirmed');
            } catch (error) {
                alert('Error booking field: ' + error.message);
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
}

.time-slot:hover {
    border-color: #667eea;
    background-color: #f5f7ff;
}

.time-slot.selected {
    border-color: #667eea;
    background-color: #667eea;
    color: white;
}

.no-slots {
    text-align: center;
    color: #999;
    padding: 20px;
    font-style: italic;
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
