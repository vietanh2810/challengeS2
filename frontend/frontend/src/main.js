import { createApp } from 'vue'
import App from './App.vue'
import vueTracker from './plugins/vueTracker' // Make sure the correct path to the vueTracker file is used

const app = createApp(App);

// Use the vueTracker plugin with the app
app.use(vueTracker, {
    APP_ID: 'test',
});


// Mount the app
app.mount('#app');

