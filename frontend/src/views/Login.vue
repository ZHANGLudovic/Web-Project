<template>
    <div class="form-container">
        <h2>Connexion</h2>
        <input type="email" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Mot de passe" v-model="password" />
        <button @click="login">Se connecter</button>
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
                    alert("Erreur: " + data.error);
                } else {
                    alert("Connexion réussie!");
                    this.$router.push('/');
                }
            })
            .catch(err => alert("Erreur: " + err.message));
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