<template>
    <div class="form-container">
        <h2>Login</h2>
        <input type="email" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Password" v-model="password" />
        <button @click="login">Login</button>
    </div>
</template>


<script>
export default {
    name: 'LoginPage',
    data() {
        return {
        email: '',
        password: '',
        };
    },
    methods: {
        login() {
            fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: this.email, password: this.password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert("Error: " + data.error);
                } else {
                    alert("Login successful!");
                    this.$router.push('/');
                }
            })
            .catch(err => alert("Error: " + err.message));
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