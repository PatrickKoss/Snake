<template>
  <v-app>
    <v-app-bar app elevate-on-scroll color="primary" dark>
      <v-toolbar-title @click="goToHome()" id="toolbarTitle">Snake</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon @click="goToDataProtection()">
        <v-icon>mdi-shield-half-full</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>

        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
  import {Vue, Component} from 'vue-property-decorator'

  @Component
  class App extends Vue {
    goToDataProtection() {
      this.$router.push("/data-protection")
    }

    goToHome() {
      this.$router.push("/")
    }
  }

  export default App
</script>
<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
  #toolbarTitle {
    cursor: pointer;
  }
</style>
