
<script>
import { watch } from "vue";
import { useRoute } from "vue-router";
import DashBoard from './components/Dashboard.vue'
import Login from './components/Login.vue'
import Signup from './components/SignUp.vue'
import Cookies from 'js-cookie';

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
  async mounted() {
    // this.$tracker.detectNewVisitor();

    // await this.$tracker.detectSession();

    // const intervalDuration = 10 * 60 * 1000;

    // this.sessionInterval = setInterval(async () => {
    //   await this.$tracker.detectSession();
    // }, intervalDuration);

    // document.addEventListener('click', this.updateLastActivity);
    // // document.addEventListener('mousemove', this.updateLastActivity);
    // document.addEventListener('keydown', this.updateLastActivity);
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
    // const route = useRoute();

    // Watch for route changes and perform actions when the route changes
    // watch(
    //   () => route.fullPath,
    //   async (newPath, oldPath) => {
    //     console.log("Route changed from:", oldPath, "to:", newPath);
    //     // You can add any custom logic here based on the route changes
    //     // For example, you can call functions to track the page view or perform other actions.
    //   }
    // );
  },
};
</script>

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
