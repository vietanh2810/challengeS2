// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueTracker from "./plugins/vueTracker";

createApp(App).use(router).use(VueTracker).mount("#app");
