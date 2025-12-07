<template>
    <div class="form-container">
        <h2>Inscription</h2>
        <input type="email" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Mot de passe" v-model="password" />


        <select v-model="role">
            <option value="user">Utilisateur</option>
            <option value="admin">Admin</option>
        </select>


        <button>S'inscrire</button>
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