<template>
    <div class="form-container">
        <h2>Sign Up</h2>
        <input type="email" placeholder="Email" v-model="email" />
        <input type="text" placeholder="Username" v-model="username" />
        <input type="password" placeholder="Password" v-model="password" />


        <select v-model="role">
            <option value="user">User</option>
            <option value="admin">Admin</option>
        </select>


        <button @click="signup">Sign Up</button>
    </div>
</template>


<script>
import api from '../api.js';

export default {
    name: 'SignupPage',
    data() {
        return {
        email: '',
        username: '',
        password: '',
        role: 'user'
        };
    },
    methods: {
        async signup() {
            if (!this.email || !this.username || !this.password) {
                alert("Please fill in all fields");
                return;
            }

            try {
                await api.auth.register(this.email, this.username, this.password);
                alert("Sign up successful!");
                this.$router.push('/login');
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