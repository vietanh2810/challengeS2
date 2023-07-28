import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./stores";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from './plugins/font-awesome'
// import vueTracker from './plugins/vueTracker' // Make sure the correct path to the vueTracker file is used

createApp(App)
    .use(router)
    .use(store)
    .component("font-awesome-icon", FontAwesomeIcon)
    .mount("#app");









