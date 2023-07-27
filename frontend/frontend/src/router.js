import { createWebHistory, createRouter } from "vue-router";
// import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Dashboard from "./components/Dashboard.vue";
import Signup from "./components/SignUp.vue";
import Admin from "./components/Admin.vue";
import Graphe from "./components/Graphe.vue";
import Heatmap from "./components/Heatmap.vue";
// import Kpi from "./components/Kpi.vue";
import Tag from "./components/Tag.vue";
import ConversionTunnel from "./components/ConversionTunnel.vue";
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
        path: "/tags",
        component: Tag
    },
    {
        path: "/conversiontunnel",
        component: ConversionTunnel
    },
    // {
    //     path: "/profile",
    //     name: "profile",
    //     // lazy-loaded
    //     component: Profile,
    // },
    {
        path: "/admin",
        name: "admin",
        // lazy-loaded
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
  // {
  //     path: "/profile",
  //     name: "profile",
  //     // lazy-loaded
  //     component: Profile,
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
