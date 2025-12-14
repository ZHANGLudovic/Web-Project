import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import Profile from '../views/Profile.vue';
import Contact from '../views/Contact.vue';
import About from '../views/About.vue';
import Sitemap from '../views/Sitemap.vue';


const routes = [
{ path: '/', name: 'Home', component: Home },
{ path: '/login', name: 'Login', component: Login },
{ path: '/signup', name: 'Signup', component: Signup },
{ path: '/profile', name: 'Profile', component: Profile },
{ path: '/contact', name: 'Contact', component: Contact },
{ path: '/about', name: 'About', component: About },
{ path: '/sitemap', name: 'Sitemap', component: Sitemap },
];


const router = createRouter({
history: createWebHistory(),
routes,
});


export default router;