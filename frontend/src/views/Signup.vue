<template>
    <div class="form-container">
        <h2>Inscription</h2>
        <input type="email" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Mot de passe" v-model="password" />


        <select v-model="role">
            <option value="user">Utilisateur</option>
            <option value="admin">Admin</option>
        </select>


        <button @click="signup">S'inscrire</button>
    </div>
</template>


<script>
export default {
    name: 'SignupPage',
    data() {
        return {
        email: '',
        password: '',
        role: 'user'
        };
    },
    methods: {
        signup() {
            fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: this.email, password: this.password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert("Erreur: " + data.error);
                } else {
                    alert("Inscription réussie!");
                    this.$router.push('/login');
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