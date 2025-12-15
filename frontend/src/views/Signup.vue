<template>
  <div class="signup-page">
    <div class="signup-container">
      <h2>Create Account</h2>
      
      <!-- Error message display -->
      <div v-if="errorMessage" class="error-banner">
        <span class="error-icon">⚠</span>
        <span class="error-text">{{ errorMessage }}</span>
        <button @click="errorMessage = ''" class="error-close">✕</button>
      </div>

      <form @submit.prevent="handleSignUp">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required
            placeholder="Choose a username"
            @input="errorMessage = ''"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            placeholder="Enter your email"
            @input="errorMessage = ''"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            placeholder="Create a password"
            @input="errorMessage = ''"
          />
          <small class="password-hint">At least 6 characters</small>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required
            placeholder="Confirm your password"
            @input="errorMessage = ''"
          />
        </div>

        <button type="submit" class="btn-signup" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Sign Up' }}
        </button>
      </form>

      <p class="login-link">
        Already have an account? 
        <router-link to="/login">Log in</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { eventBus } from '../eventBus.js';

export default {
  name: 'SignUpView',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      loading: false
    };
  },
  methods: {
    async handleSignUp() {
      this.errorMessage = '';

      // Client-side validations
      if (this.password.length < 6) {
        this.errorMessage = 'Password must be at least 6 characters long';
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match. Please try again';
        return;
      }

      this.loading = true;

      try {
        const response = await fetch('http://localhost:3000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Success - auto login and redirect
          localStorage.setItem('user', JSON.stringify(data.user));
          eventBus.emit('user-logged-in', data.user);
          this.$router.push('/');
        } else {
          // Show error message
          if (response.status === 409) {
            if (data.error.includes('email')) {
              this.errorMessage = 'This email is already registered. Please use a different email or log in';
            } else if (data.error.includes('username')) {
              this.errorMessage = 'This username is already taken. Please choose a different one';
            } else {
              this.errorMessage = data.error;
            }
          } else {
            this.errorMessage = data.error || 'Registration failed. Please try again';
          }
        }
      } catch (error) {
        console.error('SignUp error:', error);
        this.errorMessage = 'Unable to connect to server. Please check your connection';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.signup-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.signup-container {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
}

.signup-container h2 {
  margin: 0 0 30px 0;
  text-align: center;
  color: #333;
  font-size: 28px;
}

.error-banner {
  background-color: #fee;
  border: 1px solid #fcc;
  border-left: 4px solid #dc3545;
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-icon {
  color: #dc3545;
  font-size: 20px;
  flex-shrink: 0;
}

.error-text {
  flex: 1;
  color: #721c24;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.error-close {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.error-close:hover {
  background-color: #fcc;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.password-hint {
  display: block;
  margin-top: 6px;
  color: #999;
  font-size: 12px;
}

.btn-signup {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.btn-signup:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-signup:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .signup-container {
    padding: 30px 20px;
  }
}
</style>