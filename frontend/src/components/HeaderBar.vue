<template>
    <header class="header"> 
        <router-link to="/" class="logo-link">
            <div class="logo">🏟️ SportCity</div>
        </router-link>

        <div class="auth-buttons">
            <router-link to="/login"><button class="btn-login">Login</button></router-link>
            <router-link to="/signup"><button class="btn-signup">Sign Up</button></router-link>
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
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    position: sticky;
    top: 0;
    z-index: 100;
    transition: box-shadow 0.3s ease;
}

.header:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.logo-link {
    text-decoration: none;
    color: inherit;
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
}

.logo-link:hover {
    transform: scale(1.05);
}

.logo {
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 1px;
    white-space: nowrap;
}

.auth-buttons {
    display: flex;
    gap: 12px;
    align-items: center;
}

.auth-buttons a {
    text-decoration: none;
    display: flex;
}

.btn-login, .btn-signup {
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    white-space: nowrap;
}

.btn-login {
    background-color: transparent;
    color: white;
    border: 2px solid white;
}

.btn-login:hover {
    background-color: white;
    color: #2c3e50;
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.btn-login:active {
    transform: translateY(0);
}

.btn-signup {
    background-color: #4CAF50;
    color: white;
    border: 2px solid #4CAF50;
}

.btn-signup:hover {
    background-color: #45a049;
    border-color: #45a049;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    transform: translateY(-2px);
}

.btn-signup:active {
    transform: translateY(0);
}

/* Responsive design */
@media (max-width: 768px) {
    .header {
        padding: 12px 15px;
        flex-wrap: wrap;
        gap: 15px;
    }

    .logo {
        font-size: 20px;
    }

    .btn-login, .btn-signup {
        padding: 8px 16px;
        font-size: 13px;
    }

    .auth-buttons {
        gap: 10px;
        width: 100%;
        justify-content: flex-end;
    }
}

@media (max-width: 480px) {
    .header {
        padding: 10px 12px;
    }

    .logo {
        font-size: 18px;
        letter-spacing: 0.5px;
    }

    .btn-login, .btn-signup {
        padding: 6px 12px;
        font-size: 12px;
    }

    .auth-buttons {
        gap: 8px;
    }
}
</style>