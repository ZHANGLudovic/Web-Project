<template>
  <div class="reviews-section">
    <!-- Average Rating Display -->
    <div class="rating-header">
      <div class="rating-summary">
        <div class="rating-score">
          <span class="score-number">{{ averageRating.toFixed(1) }}</span>
          <div class="stars-display">
            <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(averageRating) }">★</span>
          </div>
          <span class="review-count">{{ totalReviews }} {{ totalReviews === 1 ? 'review' : 'reviews' }}</span>
        </div>
      </div>

      <!-- Write Review Button -->
      <button v-if="isLoggedIn && !hasUserReview" @click="showReviewForm = true" class="btn-write-review">
        ✍️ Write a Review
      </button>
      <span v-else-if="hasUserReview" class="your-review-badge">✓ Your Review Posted</span>
      <span v-else class="login-required">Log in to review</span>
    </div>

    <!-- Review Form Modal -->
    <div v-if="showReviewForm" class="modal-overlay" @click.self="closeReviewForm">
      <div class="review-modal">
        <div class="modal-header">
          <h3>Share Your Experience</h3>
          <button @click="closeReviewForm" class="close-btn">✕</button>
        </div>

        <form @submit.prevent="submitReview" class="review-form">
          <!-- Rating Input -->
          <div class="form-group">
            <label>Your Rating</label>
            <div class="star-input">
              <button 
                v-for="i in 5" 
                :key="i"
                type="button"
                class="star-btn"
                :class="{ active: i <= formData.rating }"
                @click="formData.rating = i"
              >
                ★
              </button>
            </div>
            <p class="rating-label">{{ ratingLabels[formData.rating] }}</p>
          </div>

          <!-- Review Text -->
          <div class="form-group">
            <label for="review-text">Your Review</label>
            <textarea 
              id="review-text"
              v-model="formData.comment"
              placeholder="Share your experience with this field..."
              maxlength="500"
              rows="5"
              required
            ></textarea>
            <span class="char-count">{{ formData.comment.length }}/500</span>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" @click="closeReviewForm" class="btn-cancel">Cancel</button>
            <button type="submit" class="btn-submit">Post Review</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reviews List -->
    <div class="reviews-list">
      <h3 class="reviews-title">All Reviews</h3>
      
      <div v-if="loading" class="loading">
        <p>Loading reviews...</p>
      </div>

      <div v-else-if="reviews.length === 0" class="no-reviews">
        <p>📝 No reviews yet. Be the first to review!</p>
      </div>

      <div v-else class="reviews-container">
        <div v-for="review in reviews" :key="review.id" class="review-card">
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">{{ getInitials(isUserOwnReview(review) ? currentUser.username : review.username) }}</div>
              <div class="reviewer-details">
                <strong v-if="isUserOwnReview(review)"> {{ currentUser.username }}</strong>
                <strong v-else>{{ review.username }}</strong>
                <p class="review-date">{{ formatDate(review.created_at) }}</p>
              </div>
            </div>
            <div class="review-rating">
              <span v-for="i in 5" :key="i" class="star-small" :class="{ filled: i <= review.rating }">★</span>
            </div>
          </div>

          <p class="review-text">{{ review.comment }}</p>

          <!-- Delete Review Button (if user's own review) -->
          <button 
            v-if="isUserOwnReview(review)"
            @click="deleteReview(review.id)"
            class="btn-delete-review"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReviewsSection',
  props: {
    fieldId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      reviews: [],
      loading: true,
      showReviewForm: false,
      averageRating: 0,
      totalReviews: 0,
      hasUserReview: false,
      currentUser: null,
      formData: {
        rating: 5,
        comment: ''
      },
      ratingLabels: {
        1: '😞 Poor',
        2: '😕 Fair',
        3: '😐 Good',
        4: '😊 Very Good',
        5: '🤩 Excellent'
      }
    };
  },
  computed: {
    isLoggedIn() {
      return this.currentUser !== null;
    }
  },
  mounted() {
    this.loadCurrentUser();
    this.fetchReviews();
  },
  methods: {
    loadCurrentUser() {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser);
        } catch (e) {
          console.error('Error parsing user:', e);
        }
      }
    },
    async fetchReviews() {
      this.loading = true;
      try {
        const response = await fetch(`http://localhost:3000/reviews/field/${this.fieldId}`);
        if (response.ok) {
          const data = await response.json();
          this.reviews = data.data || data.reviews || [];
          
          // Calculate average rating from reviews
          if (this.reviews.length > 0) {
            const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
            this.averageRating = sum / this.reviews.length;
          } else {
            this.averageRating = 0;
          }
          
          this.totalReviews = data.pagination?.total || this.reviews.length;

          // Check if current user has already reviewed
          if (this.currentUser) {
            this.hasUserReview = this.reviews.some(r => r.user_id === this.currentUser.id);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        this.$toast.error('Failed to load reviews', 'Error');
      } finally {
        this.loading = false;
      }
    },
    async submitReview() {
      if (!this.formData.rating || !this.formData.comment.trim()) {
        this.$toast.warning('Please complete all fields', 'Missing Information');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            field_id: this.fieldId,
            user_id: this.currentUser.id,
            rating: this.formData.rating,
            comment: this.formData.comment
          })
        });

        if (response.ok) {
          const data = await response.json();
          this.$toast.success('Thank you! Your review has been posted', 'Review Submitted');
          this.closeReviewForm();
          
          // Add the new review to the list immediately with username
          if (data.review) {
            this.reviews.unshift(data.review);
            // Recalculate average rating
            const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
            this.averageRating = sum / this.reviews.length;
            this.totalReviews = this.reviews.length;
            this.hasUserReview = true;
          } else {
            // Fallback to fetch if no review returned
            this.fetchReviews();
          }
        } else {
          const error = await response.json();
          this.$toast.error(error.message || 'Failed to post review', 'Error');
        }
      } catch (error) {
        console.error('Error submitting review:', error);
        this.$toast.error('Network error. Please try again', 'Error');
      }
    },
    async deleteReview(reviewId) {
      if (!confirm('Delete your review?')) return;

      try {
        const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          this.$toast.success('Review deleted', 'Success');
          this.fetchReviews();
        } else {
          this.$toast.error('Failed to delete review', 'Error');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        this.$toast.error('Network error', 'Error');
      }
    },
    closeReviewForm() {
      this.showReviewForm = false;
      this.formData = { rating: 5, comment: '' };
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return 'today';
      if (diffDays === 2) return 'yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return date.toLocaleDateString();
    },
    getInitials(username) {
      return username.substring(0, 2).toUpperCase();
    },
    isUserOwnReview(review) {
      return this.currentUser && review.user_id === this.currentUser.id;
    }
  }
};
</script>

<style scoped>
.reviews-section {
  margin-top: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  border-radius: 16px;
  border: 1px solid #e0e6f0;
}

/* Rating Header */
.rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid white;
}

.rating-summary {
  flex: 1;
}

.rating-score {
  display: flex;
  align-items: center;
  gap: 20px;
}

.score-number {
  font-size: 48px;
  font-weight: 700;
  color: #667eea;
  line-height: 1;
}

.stars-display {
  display: flex;
  gap: 4px;
}

.star {
  font-size: 24px;
  color: #ddd;
  transition: color 0.3s ease;
}

.star.filled {
  color: #ffc107;
}

.review-count {
  font-size: 14px;
  color: #666;
  display: block;
  margin-top: 8px;
  font-weight: 600;
}

.btn-write-review {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.2);
}

.btn-write-review:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.35);
}

.your-review-badge {
  background: #d4edda;
  color: #155724;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}

.login-required {
  color: #666;
  font-size: 14px;
  font-weight: 600;
}

/* Review Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.review-modal {
  background: white;
  border-radius: 16px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px 16px 0 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.review-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.star-input {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.star-btn {
  width: 50px;
  height: 50px;
  border: 2px solid #e0e6f0;
  background: white;
  border-radius: 8px;
  font-size: 28px;
  color: #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
}

.star-btn:hover {
  border-color: #ffc107;
  color: #ffc107;
  transform: scale(1.1);
}

.star-btn.active {
  background: #ffc107;
  border-color: #ffc107;
  color: white;
}

.rating-label {
  margin: 8px 0 0 0;
  font-size: 14px;
  color: #667eea;
  font-weight: 600;
}

.review-form textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e6f0;
  border-radius: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  resize: vertical;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.review-form textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 5px rgba(102, 126, 234, 0.12);
}

.char-count {
  display: block;
  text-align: right;
  font-size: 12px;
  color: #999;
  margin-top: 6px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #e0e6f0;
}

.btn-cancel, .btn-submit {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-cancel {
  background: #e8eef8;
  color: #667eea;
  border: 2px solid #d8dce8;
}

.btn-cancel:hover {
  background: #d8dce8;
  transform: translateY(-2px);
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.2);
}

.btn-submit:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.35);
}

/* Reviews List */
.reviews-list {
  margin-top: 30px;
}

.reviews-title {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
  font-weight: 700;
}

.loading {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 16px;
}

.no-reviews {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 16px;
  background: white;
  border-radius: 12px;
  border: 2px dashed #e0e6f0;
}

.reviews-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e6f0;
  transition: all 0.3s ease;
}

.review-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.reviewer-info {
  display: flex;
  gap: 12px;
  flex: 1;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.reviewer-details strong {
  display: block;
  color: #333;
  font-size: 15px;
  margin-bottom: 4px;
}

.review-date {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.review-rating {
  display: flex;
  gap: 2px;
}

.star-small {
  font-size: 16px;
  color: #ddd;
}

.star-small.filled {
  color: #ffc107;
}

.review-text {
  color: #555;
  font-size: 14px;
  line-height: 1.6;
  margin: 12px 0;
}

.btn-delete-review {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 12px;
}

.btn-delete-review:hover {
  background: #f5c6cb;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .rating-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .review-modal {
    width: 95%;
  }

  .review-card {
    padding: 16px;
  }
}
</style>
