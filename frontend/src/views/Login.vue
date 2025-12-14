<template>
    <div class="form-container">
        <h2>Login</h2>
        <input type="email" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Password" v-model="password" />
        <button @click="login">Login</button>
    </div>
</template>


<script>
import api from '../api.js';
import { eventBus } from '../eventBus.js';

export default {
    name: 'LoginPage',
    data() {
        return {
        email: '',
        password: '',
        };
    },
    methods: {
        async login() {
            if (!this.email || !this.password) {
                alert("Please fill in all fields");
                return;
            }

            try {
                const data = await api.auth.login(this.email, this.password);
                
                // Store user info in localStorage first
                localStorage.setItem('user', JSON.stringify(data.user));
                // Notify App.vue of login
                eventBus.emit('user-logged-in', data.user);
                alert("Login successful!");
                // Add a small delay to ensure event is processed before navigation
                await new Promise(resolve => setTimeout(resolve, 100));
                this.$router.push('/');
            } catch (error) {
                alert("Error: " + error.message);
            }
        }
    }
};
</script>


<style scoped>
.form-container {
    max-width: 400px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
}
</style>