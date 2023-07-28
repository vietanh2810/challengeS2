import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./stores";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from './plugins/font-awesome'
// import vueTracker from './plugins/vueTracker' // Make sure the correct path to the vueTracker file is used

import Login from "./components/Login.vue";
import Dashboard from "./components/Dashboard.vue";
import Signup from "./components/SignUp.vue";
import Admin from "./components/Admin.vue";
import Sdk from "./components/SDK.vue"
import Graphe from "./components/Graphe.vue";
import Heatmap from "./components/Heatmap.vue";
import Kpi from "./components/Kpi.vue";
import Tag from "./components/Tag.vue";
import ConversionTunnel from "./components/ConversionTunnel.vue";

createApp(App)
    .use(router)
    .use(store)
    .component("font-awesome-icon", FontAwesomeIcon)
    .component("Dashboard", Dashboard)
    .component("Login", Login)
    .component("Signup", Signup)
    .component("Admin", Admin)
    .component("Sdk", Sdk)
    .component("Graphe", Graphe)
    .component("Kpi", Kpi)
    .component("Heatmap", Heatmap)
    .component("Tag", Tag)
    .component("ConversionTunnel", ConversionTunnel)
    .mount("#app");









