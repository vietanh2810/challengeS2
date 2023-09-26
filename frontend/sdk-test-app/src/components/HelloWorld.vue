<template>
  <div class="hello" style="background-color: aquamarine; width: 100%; height: 100%;"> 
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <button v-tracker-hover="{ tag: 'eslint'}" v-tracker-click="{ tag: 'eslint'}">vue-cli documentation</button>
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li v-tracker-hover="{ tag: 'babel'}" v-tracker-click="{ tag: 'babel'}"><button>babel</button></li>
      <li v-tracker-hover="{ tag: 'eslint'}" v-tracker-click="{ tag: 'eslint'}"><button>eslint</button></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><button v-tracker-click="{ tag: 'core-docs-tags'}">Core Docs</button></li>
      <li><button>Forum</button></li>
      <li><button>Community Chat</button></li>
      <li><button>Twitter</button></li>
      <li><button>News</button></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><button v-tracker-hover="{ tag: 'vvue-router'}" v-tracker-click="{ tag: 'vvue-router'}">vvue-router</button></li>
      <li><button v-tracker-hover="{ tag: 'vuex'}" v-tracker-click="{ tag: 'vuex'}">vuex</button></li>
      <li><button v-tracker-hover="{ tag: 'devtools'}" v-tracker-click="{ tag: 'devtools'}">vue-devtools</button></li>
      <li><button v-tracker-hover="{ tag: 'loader'}" v-tracker-click="{ tag: 'loader'}">vue-loader</button></li>
      <li><button v-tracker-hover="{ tag: 'awesome'}" v-tracker-click="{ tag: 'awesome'}">awesome-vue</button></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
