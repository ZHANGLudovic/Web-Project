<template>
  <div class="reservations-page">
    <div class="container">
      <h1 class="page-title">📅 My Reservations</h1>
      
      <!-- Loading state -->
      <div v-if="loading" class="loading">
        <p>Loading your reservations...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="reservations.length === 0" class="empty-state">
        <p class="empty-icon">📭</p>
        <h2>No reservations yet</h2>
        <p>Start booking your favorite sports fields!</p>
        <router-link to="/">
          <button class="btn-browse">Browse Fields</button>
        </router-link>
      </div>

      <!-- Reservations list -->
      <div v-else class="reservations-grid">
        <div v-for="reservation in reservations" :key="reservation.id" class="reservation-card">
          <div class="card-header">
            <span class="status-badge" :class="reservation.status">
              {{ reservation.status }}
            </span>
            <button @click="cancelReservation(reservation.id)" class="btn-cancel" title="Cancel reservation">
              🗑️
            </button>
          </div>

          <div class="card-body">
            <div class="field-info">
              <img :src="reservation.image_url || '/Image/default-field.jpg'" 
                   :alt="reservation.field_name" 
                   class="field-image"
                   @error="handleImageError">
              <div class="field-details">
                <h3>{{ reservation.field_name }}</h3>
                <p class="sport-type">🏅 {{ reservation.sport }}</p>
                <p class="location">📍 {{ reservation.adresse }}, {{ reservation.ville }}</p>
              </div>
            </div>

            <div class="reservation-details">
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">{{ formatDate(reservation.reservation_date) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">{{ reservation.start_time }} - {{ reservation.end_time }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Duration:</span>
                <span class="value">{{ calculateDuration(reservation.start_time, reservation.end_time) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Total Price:</span>
                <span class="value price">{{ reservation.total_price }}€</span>
              </div>
              <div v-if="reservation.notes" class="detail-row notes">
                <span class="label">Notes:</span>
                <span class="value">{{ reservation.notes }}</span>
              </div>
            </div>

            <div class="card-footer">
              <small>Booked on: {{ formatDateTime(reservation.created_at) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyReservations',
  data() {
    return {
      reservations: [],
      loading: true,
      user: null
    };
  },
  mounted() {
    this.loadUser();
    this.fetchReservations();
  },
  methods: {
    loadUser() {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          this.user = JSON.parse(storedUser);
        } catch (e) {
          console.error('Error parsing user:', e);
          this.$router.push('/login');
        }
      } else {
        this.$router.push('/login');
      }
    },
    async fetchReservations() {
      if (!this.user) return;

      this.loading = true;
      try {
        const response = await fetch(`http://localhost:3000/reservations/user/${this.user.id}`);
        if (response.ok) {
          this.reservations = await response.json();
          console.log('Reservations loaded:', this.reservations);
        } else {
          console.error('Failed to fetch reservations');
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
        alert('Failed to load reservations. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    async cancelReservation(reservationId) {
      if (!confirm('Are you sure you want to cancel this reservation?')) {
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/reservations/${reservationId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: this.user.id })
        });

        if (response.ok) {
          // Remove unused variable
          this.reservations = this.reservations.filter(r => r.id !== reservationId);
        } else {
          const error = await response.json();
          this.$toast.error(error.error || 'Unable to cancel reservation', 'Cancellation Failed');
        }
      } catch (error) {
        console.error('Error canceling reservation:', error);
        this.$toast.error('Network error. Please try again', 'Connection Error');
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },
    formatDateTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    calculateDuration(startTime, endTime) {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    },
    handleImageError(event) {
      event.target.src = '/Image/default-field.jpg';
    }
  }
};
</script>

<style scoped>
.reservations-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: white;
  font-size: 36px;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.loading {
  text-align: center;
  color: white;
  font-size: 18px;
  padding: 60px 20px;
}

.empty-state {
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h2 {
  color: #333;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
  margin-bottom: 30px;
}

.btn-browse {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-browse:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.reservations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.reservation-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.reservation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.confirmed {
  background: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.cancelled {
  background: #f8d7da;
  color: #721c24;
}

.btn-cancel {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #c82333;
  transform: scale(1.1);
}

.card-body {
  padding: 20px;
}

.field-info {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.field-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}

.field-details h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 20px;
}

.sport-type {
  color: #667eea;
  font-weight: 600;
  margin: 4px 0;
}

.location {
  color: #666;
  font-size: 14px;
  margin: 4px 0;
}

.reservation-details {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row.notes {
  flex-direction: column;
  gap: 4px;
}

.label {
  font-weight: 600;
  color: #555;
}

.value {
  color: #333;
}

.value.price {
  color: #28a745;
  font-weight: 700;
  font-size: 18px;
}

.card-footer {
  text-align: center;
  color: #999;
  font-size: 12px;
}

@media (max-width: 768px) {
  .reservations-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 28px;
  }

  .field-info {
    flex-direction: column;
  }

  .field-image {
    width: 100%;
    height: 200px;
  }
}
</style>
