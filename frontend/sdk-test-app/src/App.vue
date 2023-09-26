<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  async mounted() {
    this.$tracker.detectNewVisitor();

    await this.$tracker.detectSession();

    const intervalDuration = 10 * 60 * 1000;

    this.sessionInterval = setInterval(async () => {
      await this.$tracker.detectSession();
    }, intervalDuration);

    document.addEventListener('click', this.updateLastActivity);
    // document.addEventListener('mousemove', this.updateLastActivity);
    document.addEventListener('keydown', this.updateLastActivity);
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
