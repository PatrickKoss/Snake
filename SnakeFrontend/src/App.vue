<template>
  <v-app v-bind:class="{ dark: state.dark, light: !state.dark }">
    <Toolbar/>

    <NavigationDrawer/>

    <!-- Sizes your content based upon application components -->
    <v-content>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>

        <!-- If using vue-router -->
        <router-view/>
      </v-container>
    </v-content>

    <v-footer app>
      <!-- -->
    </v-footer>

    <MessageSnackbar/>
    <CookieBanner />
  </v-app>
</template>

<script>
  import {Component, Vue} from 'vue-property-decorator'
  import NavigationDrawer from "./components/NavigationDrawer";
  import {UserRestClient} from "./model/UserRestClient";
  import Toolbar from "./components/Toolbar";
  import MessageSnackbar from "./components/MessageSnackbar";
  import CookieBanner from "./components/CookieBanner";

  @Component({
    components: {
      NavigationDrawer,
      Toolbar,
      MessageSnackbar,
      CookieBanner,
    }
  })
  class App extends Vue {
    state = this.$store.state;

    async created() {
      // set the state token according to the local storage token
      if (localStorage.token !== undefined) this.state.token = localStorage.token;
      let response = await new UserRestClient().getAuthenticated();
      if (response.message.messageType === "error") {
        localStorage.token = undefined;
        this.state.token = "";
      } else {
        this.state.user = response.user;
      }

      // set the state dark according to the local storage dark
      this.state.dark = localStorage.dark === 'true';

      // trick the login mistake
      await new UserRestClient().login({username: "", email:"", password:""});
    }
  }

  export default App
</script>
<style lang="scss" scoped>
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
