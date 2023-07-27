import { createWebHistory, createRouter } from "vue-router";
// import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Dashboard from "./components/Dashboard.vue";
import Signup from "./components/SignUp.vue";
import Admin from "./components/Admin.vue";
import Sdk from "./components/SDK.vue"
import Tag from "./components/Tag.vue";
// import Register from "./components/Register.vue";
// lazy-loaded
// const Profile = () => import("./components/Profile.vue")
// const BoardAdmin = () => import("./components/BoardAdmin.vue")
// const BoardModerator = () => import("./components/BoardModerator.vue")
// const BoardUser = () => import("./components/BoardUser.vue")

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
        path: "/admin",
        component: Admin,
    },
    // {
    //     path: "/mod",
    //     name: "moderator",
    //     // lazy-loaded
    //     component: BoardModerator,
    // },
    // {
    //     path: "/user",
    //     name: "user",
    //     // lazy-loaded
    //     component: BoardUser,
    // },
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

    // trying to access a restricted page + not logged in
    // redirect to login page
    if (authRequired && !loggedIn) {
        next('/login');
    } else if (to.path === '/admin' && userRole !== 'admin') {
        // trying to access /admin without admin role
        // redirect to dashboard or another route
        next(from.path);
    } else {
        next();
    }
});

export default router;