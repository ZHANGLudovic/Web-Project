<template>
    <div class="profile-container">
        <h2>My Profile</h2>
        
        <div v-if="!user" class="no-user">
            <p>Please log in to view your profile.</p>
            <router-link to="/login"><button>Go to Login</button></router-link>
        </div>

        <div v-else class="profile-content">
            <!-- Rank Section -->
            <div class="rank-section">
                <div class="rank-display">
                    <div class="rank-icon">{{ rankIcon }}</div>
                    <div class="rank-info">
                        <h3>{{ rank }}</h3>
                        <p>{{ reservationCount }} booking{{ reservationCount !== 1 ? 's' : '' }}</p>
                    </div>
                </div>
                <div class="rank-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
                    </div>
                    <p class="progress-text">{{ nextRankText }}</p>
                </div>
            </div>

            <!-- Profile Form -->
            <div class="profile-form">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input 
                        v-model="formData.username" 
                        type="text" 
                        id="username" 
                        placeholder="Enter your username"
                        :disabled="!isEditing"
                    />
                </div>

                <div class="form-group">
                    <label for="email">Email:</label>
                    <input 
                        v-model="formData.email" 
                        type="email" 
                        id="email" 
                        placeholder="Enter your email"
                        :disabled="!isEditing"
                    />
                </div>

                <div class="form-actions">
                    <button 
                        v-if="!isEditing" 
                        @click="enableEdit" 
                        class="btn-edit"
                    >
                        ✏️ Edit
                    </button>
                    <div v-else class="edit-buttons">
                        <button @click="saveChanges" class="btn-save">💾 Save</button>
                        <button @click="cancelEdit" class="btn-cancel">❌ Cancel</button>
                    </div>
                </div>

                <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../api.js';
import { eventBus } from '../eventBus.js';

export default {
    name: 'ProfilePage',
    data() {
        return {
            user: null,
            formData: {
                username: '',
                email: ''
            },
            isEditing: false,
            successMessage: '',
            errorMessage: '',
            reservationCount: 0,
            ranks: [
                { name: 'Iron', icon: '⚙️', min: 0, max: 2 },
                { name: 'Bronze', icon: '🥉', min: 3, max: 5 },
                { name: 'Silver', icon: '🥈', min: 6, max: 9 },
                { name: 'Gold', icon: '🥇', min: 10, max: 14 },
                { name: 'Platinum', icon: '💎', min: 15, max: 20 },
                { name: 'Diamond', icon: '💠', min: 21, max: 30 },
                { name: 'Ascendant', icon: '⭐', min: 31, max: 50 },
                { name: 'Radiant', icon: '👑', min: 51, max: Infinity }
            ]
        };
    },
    computed: {
        rank() {
            const currentRank = this.ranks.find(r => 
                this.reservationCount >= r.min && this.reservationCount <= r.max
            );
            return currentRank ? currentRank.name : 'Iron';
        },
        rankIcon() {
            const currentRank = this.ranks.find(r => 
                this.reservationCount >= r.min && this.reservationCount <= r.max
            );
            return currentRank ? currentRank.icon : '⚙️';
        },
        progressPercentage() {
            const currentRank = this.ranks.find(r => 
                this.reservationCount >= r.min && this.reservationCount <= r.max
            );
            if (!currentRank || currentRank.max === Infinity) return 100;
            
            const rangeSize = currentRank.max - currentRank.min + 1;
            const progress = this.reservationCount - currentRank.min;
            return Math.min(100, (progress / rangeSize) * 100);
        },
        nextRankText() {
            const currentRank = this.ranks.find(r => 
                this.reservationCount >= r.min && this.reservationCount <= r.max
            );
            
            if (!currentRank || currentRank.max === Infinity) {
                return 'You\'ve reached the highest rank!';
            }
            
            const nextRank = this.ranks[this.ranks.indexOf(currentRank) + 1];
            const needed = nextRank.min - this.reservationCount;
            return `${needed} more booking${needed !== 1 ? 's' : ''} to reach ${nextRank.name}`;
        }
    },
    mounted() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                this.user = JSON.parse(storedUser);
                this.formData.username = this.user.username;
                this.formData.email = this.user.email;
                this.fetchReservations();
            } catch (e) {
                console.error('Error parsing stored user:', e);
                this.user = null;
            }
        }

        eventBus.on('user-logged-in', (user) => {
            this.user = user;
            this.formData.username = user.username;
            this.formData.email = user.email;
            this.fetchReservations();
        });

        eventBus.on('user-logged-out', () => {
            this.user = null;
            this.formData = { username: '', email: '' };
            this.isEditing = false;
            this.reservationCount = 0;
        });

        // Listen for booking confirmations and refresh reservations
        eventBus.on('booking-confirmed', () => {
            this.fetchReservations();
        });
    },
    methods: {
        async fetchReservations() {
            if (!this.user) return;
            
            try {
                const reservations = await api.users.getReservations(this.user.id);
                this.reservationCount = Array.isArray(reservations) ? reservations.length : (reservations.reservations ? reservations.reservations.length : 0);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                this.reservationCount = 0;
            }
        },
        enableEdit() {
            this.isEditing = true;
            this.successMessage = '';
            this.errorMessage = '';
        },
        cancelEdit() {
            this.formData.username = this.user.username;
            this.formData.email = this.user.email;
            this.isEditing = false;
            this.errorMessage = '';
        },
        async saveChanges() {
            if (!this.formData.username || !this.formData.email) {
                this.errorMessage = 'Username and email are required';
                return;
            }

            try {
                const updatedData = await api.users.updateProfile(this.user.id, {
                    username: this.formData.username,
                    email: this.formData.email
                });

                this.user = updatedData.user;
                localStorage.setItem('user', JSON.stringify(this.user));
                
                eventBus.emit('user-logged-in', this.user);

                this.isEditing = false;
                this.successMessage = 'Profile updated successfully!';
                this.errorMessage = '';
                
                setTimeout(() => {
                    this.successMessage = '';
                }, 3000);
            } catch (error) {
                this.errorMessage = 'Error updating profile: ' + error.message;
                this.successMessage = '';
            }
        }
    }
};
</script>

<style scoped>
.profile-container {
    max-width: 500px;
    margin: 40px auto;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
}

.profile-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.rank-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    border-radius: 8px;
    color: white;
}

.rank-display {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
}

.rank-icon {
    font-size: 60px;
    line-height: 1;
}

.rank-info h3 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
}

.rank-info p {
    margin: 5px 0 0 0;
    font-size: 14px;
    opacity: 0.9;
}

.rank-progress {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background-color: #4ade80;
    border-radius: 4px;
    transition: width 0.3s ease;
}

.progress-text {
    margin: 10px 0 0 0;
    font-size: 12px;
    opacity: 0.9;
}

.no-user {
    text-align: center;
    padding: 20px;
    color: #666;
}

.no-user button {
    margin-top: 15px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.no-user button:hover {
    background-color: #0056b3;
}

.profile-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-weight: 600;
    color: #333;
    font-size: 14px;
}

.form-group input {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.3s ease;
}

.form-group input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-group input:disabled {
    background-color: #f5f5f5;
    color: #666;
    cursor: not-allowed;
}

.form-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 10px;
}

.btn-edit,
.btn-save,
.btn-cancel {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-edit {
    background-color: #007bff;
    color: white;
}

.btn-edit:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
}

.btn-save {
    background-color: #28a745;
    color: white;
}

.btn-save:hover {
    background-color: #218838;
    transform: translateY(-2px);
}

.btn-cancel {
    background-color: #6c757d;
    color: white;
}

.btn-cancel:hover {
    background-color: #5a6268;
    transform: translateY(-2px);
}

.edit-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.success-message {
    color: #28a745;
    text-align: center;
    padding: 10px;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    border-radius: 4px;
    font-size: 14px;
    margin: 0;
}

.error-message {
    color: #dc3545;
    text-align: center;
    padding: 10px;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    font-size: 14px;
    margin: 0;
}
</style>
