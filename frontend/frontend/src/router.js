import { createWebHistory, createRouter } from "vue-router";
import Login from "./components/Login.vue";
import Dashboard from "./components/Dashboard.vue";
import Signup from "./components/SignUp.vue";
import Admin from "./components/Admin.vue";
import Sdk from "./components/Sdk.vue"
import Graphe from "./components/Graphe.vue";
import Heatmap from "./components/Heatmap.vue";
import Kpi from "./components/Kpi.vue";
import Tag from "./components/Tag.vue";
import ConversionTunnel from "./components/ConversionTunnel.vue";

const routes = [
    {
        path: "/login",
        component: Login,
    },
    {
        path: "/dashboard",
        component: Dashboard,
    },
    {
        path: "/signup",
        component: Signup
    },
    {
        path: "/sdk",
        component: Sdk
    },
    {
        path: "/conversiontunnel",
        component: ConversionTunnel
    },
    {
        path: "/admin",
        component: Admin,
    },
    {
        path: "/graphe",
        component: Graphe,
    },
    {
        path: "/heatmap",
        component: Heatmap,
    },
    {
        path: "/kpi",
        component: Kpi,
    },
    {   
        path: "/tags",
        component: Tag
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/signup'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');
    const userRole = loggedIn ? JSON.parse(loggedIn).user.role : null;

    if (authRequired && !loggedIn) {
        next('/login');
    } else if (to.path === '/admin' && userRole !== 'admin') {
        next(from.path);
    } else {
        next();
    }
});

export default router;
