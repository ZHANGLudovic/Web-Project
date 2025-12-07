<template>
    <div class="form-container">
        <h2>Connexion</h2>
        <input type="email" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Mot de passe" v-model="password" />
        <button>Se connecter</button>
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