// API Service for SportCity Frontend
const API_BASE_URL = 'http://localhost:3000';

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API Error');
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    throw error;
  }
};

const api = {
  // Auth endpoints
  auth: {
    register: (email, username, password) =>
      apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, username, password })
      }),
    login: (email, password) =>
      apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }),
    logout: () =>
      apiCall('/auth/logout', { method: 'POST' })
  },

  // Fields endpoints
  fields: {
    getAll: (filters = {}) => {
      const params = new URLSearchParams(filters);
      return apiCall(`/fields?${params}`);
    },
    getById: (id) =>
      apiCall(`/fields/${id}`),
    create: (fieldData) =>
      apiCall('/fields', {
        method: 'POST',
        body: JSON.stringify(fieldData)
      }),
    update: (id, fieldData) =>
      apiCall(`/fields/${id}`, {
        method: 'PUT',
        body: JSON.stringify(fieldData)
      }),
    delete: (id) =>
      apiCall(`/fields/${id}`, { method: 'DELETE' }),
    getBySport: (sport) =>
      apiCall(`/fields/sport/${sport}`),
    getByCity: (city) =>
      apiCall(`/fields/city/${city}`)
  },

  // Users endpoints
  users: {
    getProfile: (userId) =>
      apiCall(`/users/${userId}`),
    updateProfile: (userId, data) =>
      apiCall(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    getReservations: (userId, filters = {}) => {
      const params = new URLSearchParams(filters);
      return apiCall(`/users/${userId}/reservations?${params}`);
    },
    createReservation: (userId, reservationData) =>
      apiCall(`/users/${userId}/reservations`, {
        method: 'POST',
        body: JSON.stringify(reservationData)
      }),
    updateReservation: (userId, reservationId, data) =>
      apiCall(`/users/${userId}/reservations/${reservationId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    cancelReservation: (userId, reservationId) =>
      apiCall(`/users/${userId}/reservations/${reservationId}`, {
        method: 'DELETE'
      })
  },

  // Sports endpoints
  sports: {
    getAll: () =>
      apiCall('/sports'),
    getWithCount: () =>
      apiCall('/sports/with-count'),
    getById: (id) =>
      apiCall(`/sports/${id}`),
    create: (sportData) =>
      apiCall('/sports', {
        method: 'POST',
        body: JSON.stringify(sportData)
      }),
    update: (id, sportData) =>
      apiCall(`/sports/${id}`, {
        method: 'PUT',
        body: JSON.stringify(sportData)
      }),
    delete: (id) =>
      apiCall(`/sports/${id}`, { method: 'DELETE' })
  },

  // Reviews endpoints
  reviews: {
    getFieldReviews: (fieldId, filters = {}) => {
      const params = new URLSearchParams(filters);
      return apiCall(`/reviews/field/${fieldId}?${params}`);
    },
    getUserReview: (fieldId, userId) =>
      apiCall(`/reviews/field/${fieldId}/user/${userId}`),
    create: (reviewData) =>
      apiCall('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData)
      }),
    update: (id, reviewData) =>
      apiCall(`/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify(reviewData)
      }),
    delete: (id) =>
      apiCall(`/reviews/${id}`, { method: 'DELETE' })
  },

  // Health check
  health: () =>
    apiCall('/health')
};

export default api;
