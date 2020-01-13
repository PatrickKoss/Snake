<template>
  <v-row no-gutters>
    <v-col
            v-for="mode in modes"
            :key="mode.id"
            class="pa-2"
            outlined
            tile

    >
      <v-card
              class="mx-auto"
              max-width="400"
              style="margin-bottom: 15px"
              hover
              @click="navigateToRoute(mode.link)"
      >
        <v-img
                class="align-end"
                height="200px"
                :src="require(`@/assets/${mode.picture}`)"
        >
          <v-card-title :style="'color:' + mode.titleColor">{{mode.title}}</v-card-title>
        </v-img>

        <v-card-actions class="justify-end">
          <v-btn
                  color="primary"
                  rounded
                  @click="navigateToRoute(mode.link)"
          >
            Go there
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import {Vue, Component} from 'vue-property-decorator'
  import { Socket } from 'vue-socket.io-extended'
  import {UserRestClient} from "../model/UserRestClient";

  @Component
  class Home extends Vue {
    modes = [{
      id: 0,
      title: "Play vs others",
      titleColor: "white",
      picture: "competition.jpg",
      link: "/vs-others",
    },
      {
        id: 1,
        title: "Play vs AI",
        titleColor: "white",
        picture: "ai.jpg",
        link: "/vs-ai",
      },
      {
        id: 2,
        title: "Play alone",
        titleColor: "white",
        picture: "alone.jpg",
        link: "/alone",
      },
      {
        id: 3,
        title: "See the AI play",
        titleColor: "white",
        picture: "aiplays.jpg",
        link: "/ai",
      },
    ];

    navigateToRoute(link) {
      this.$router.push(link);
    }

    @Socket('clicked')  // --> listens to the event with given name, e.g. `tweet`
    clicked (message) {
      // eslint-disable-next-line no-console
      console.log(message);
    }

    async mounted() {
      this.$socket.client.connect();
      this.$socket.client.emit('connected', "connected");
      window.addEventListener('keydown', this.keyDown, false);
      let users = await new UserRestClient().getUsers();
      let test = await new UserRestClient().getTestData();
      // eslint-disable-next-line no-console
      console.log(users);
      // eslint-disable-next-line no-console
      console.log(test);
    }

    keyDown(e) {
      // eslint-disable-next-line no-console
      console.log(e.key);
      this.$socket.client.emit(e.key, e.key);
    }

    beforeDestroy() {
      window.removeEventListener("keydown", this.keyDown, false);
      this.$socket.client.disconnect();
    }
  }

  export default Home
</script>
<style scoped>
</style>
