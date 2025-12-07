<template>
    <header class="header"> 
        <router-link to="/" class="logo-link">
            <div class="logo">🏟️ SportCity</div>
        </router-link>

        <div class="auth-buttons">
            <router-link to="/login"><button class="btn-login">Connexion</button></router-link>
            <router-link to="/signup"><button class="btn-signup">Inscription</button></router-link>
        </div>
    </header>
</template>


<script>
export default {
    name: 'HeaderBar',
};
</script>


<style scoped>
.header {
    width: 100%;
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: white;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    position: sticky;
    top: 0;
    z-index: 100;
}


.logo-link {
    text-decoration: none;
    color: inherit;
    transition: transform 0.3s ease;
}


.logo-link:hover {
    transform: scale(1.05);
}


.logo {
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 1px;
}


.auth-buttons {
    display: flex;
    gap: 12px;
}


.auth-buttons a {
    text-decoration: none;
}


.btn-login, .btn-signup {
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}


.btn-login {
    background-color: transparent;
    color: white;
    border: 2px solid white;
}


.btn-login:hover {
    background-color: white;
    color: #2c3e50;
    transform: translateY(0);
    box-shadow: none;
}


.btn-signup {
    background-color: #4CAF50;
    color: white;
}


.btn-signup:hover {
    background-color: #45a049;
}
</style>