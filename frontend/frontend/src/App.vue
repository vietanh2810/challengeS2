
<script>
import DashBoard from './components/Dashboard.vue'
import Login from './components/Login.vue'
import Signup from './components/SignUp.vue'


export default {
  name: 'App',
  components: {
    DashBoard,
    Login,
    Signup
  },
  data() {
    return {
      sessionInterval: null
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_ADMIN');
      }

      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_MODERATOR');
      }

      return false;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  },
  setup() {
  },
};
</script>

<!-- // App.vue
<template>
  <div id="app">
    <StreamUpdates />
  </div>
</template>

<script>
import Vue from "vue";
import StreamUpdates from "./components/StreamUpdates.vue";
import store from "./store"; // Import the Vuex store

export default {
  components: {
    StreamUpdates,
  },
  created() {
    // Set up an SSE event listener to receive messages from the server
    const eventSource = new EventSource("/api/events");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received SSE message in App:", data);
      store.dispatch("updateSSEMessage", data); // Update the Vuex store with the received SSE message
    };

    eventSource.onerror = (event) => {
      console.error("Error in SSE stream:", event);
    };
  },
};
</script> -->


<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
