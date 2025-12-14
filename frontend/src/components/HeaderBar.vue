<template>
    <header class="header"> 
        <router-link to="/" class="logo-link">
            <div class="logo">🏟️ SportCity</div>
        </router-link>

        <div class="auth-buttons">
            <!-- Show when not logged in -->
            <template v-if="!user">
                <router-link to="/login"><button class="btn-login">Login</button></router-link>
                <router-link to="/signup"><button class="btn-signup">Sign Up</button></router-link>
            </template>
            <!-- Show when logged in -->
            <div v-else class="user-menu">
                <button @click="toggleMenu" class="user-button">
                    👤 {{ user.username }}
                </button>
                <div v-if="showMenu" class="dropdown-menu">
                    <router-link to="/profile" class="menu-item">
                        <span>👤 Profile</span>
                    </router-link>
                    <router-link to="/reservations" class="menu-item">
                        <span>📅 My Reservations</span>
                    </router-link>
                    <button @click="logout" class="menu-item logout-item">
                        <span>🚪 Logout</span>
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>


<script>
import { eventBus } from '../eventBus.js';

export default {
    name: 'HeaderBar',
    data() {
        return {
            user: null,
            showMenu: false
        };
    },
    mounted() {
        // Check if user is stored in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                this.user = JSON.parse(storedUser);
            } catch (e) {
                console.error('Error parsing stored user:', e);
                localStorage.removeItem('user');
                this.user = null;
            }
        }

        // Listen for login event
        eventBus.on('user-logged-in', (user) => {
            this.user = user;
            this.showMenu = false;
        });

        // Listen for logout event
        eventBus.on('user-logged-out', () => {
            this.user = null;
            this.showMenu = false;
        });
    },
    methods: {
        toggleMenu() {
            this.showMenu = !this.showMenu;
        },
        logout() {
            localStorage.removeItem('user');
            this.user = null;
            this.showMenu = false;
            eventBus.emit('user-logged-out');
            alert('You have been logged out');
            this.$router.push('/');
        }
    }
};
</script>


<style scoped>
.header {
    width: 100%;
    background: linear-gradient(135deg, rgba(44,62,80,0.85) 0%, rgba(52,73,94,0.85) 100%);
    color: white;
    padding: 16px 20px;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    position: sticky;
    top: 0;
    z-index: 100;
    transition: box-shadow 0.3s ease;
    border-bottom: 1px solid rgba(255,255,255,0.06);
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

/* User Menu Styles */
.user-menu {
    position: relative;
    display: flex;
    align-items: center;
}

.user-button {
    padding: 10px 20px;
    background-color: rgba(255, 255, 255, 0.15);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
}

.user-button:hover {
    background-color: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}

.user-button:active {
    transform: translateY(0);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    min-width: 200px;
    margin-top: 8px;
    overflow: hidden;
    animation: slideDown 0.3s ease;
    z-index: 1000;
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

.menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    color: #333;
    text-decoration: none;
    transition: all 0.2s ease;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}

.menu-item:not(.logout-item) {
    border-bottom: 1px solid #eee;
}

.menu-item:hover {
    background-color: #f0f0f0;
    color: #2f80ed;
}

.logout-item {
    color: #e74c3c;
}

.logout-item:hover {
    background-color: #fee;
    color: #c0392b;
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

    .user-button {
        padding: 8px 16px;
        font-size: 13px;
    }

    .dropdown-menu {
        min-width: 180px;
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

    .user-button {
        padding: 6px 12px;
        font-size: 12px;
    }

    .user-button span:last-child {
        display: none;
    }

    .dropdown-menu {
        min-width: 160px;
        right: -10px;
    }

    .menu-item {
        padding: 10px 16px;
        font-size: 13px;
    }
}
</style>