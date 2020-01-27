<template>
  <v-row :dark="state.dark" no-gutters>
    <v-col
            :key="mode.id"
            class="pa-2"
            outlined
            tile
            v-for="mode in modes"

    >
      <v-card
              :dark="state.dark"
              @click="navigateToRoute(mode.link)"
              class="mx-auto"
              hover
              max-width="400"
              style="margin-bottom: 15px"
      >
        <v-img
                :src="require(`@/assets/${mode.picture}`)"
                class="align-end"
                height="200px"
        >
          <v-card-title :style="'color:' + mode.titleColor">{{mode.title}}</v-card-title>
        </v-img>

        <v-card-actions class="justify-end">
          <v-btn
                  @click="navigateToRoute(mode.link)"
                  color="primary"
                  rounded
          >
            Go there
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import {Component, Vue} from 'vue-property-decorator'

  @Component
  class Home extends Vue {
    state = this.$store.state;
    modes = [
      {
        id: 1,
        title: "Play vs AI",
        titleColor: "white",
        picture: "ai.jpg",
        link: "/vs-ai",
      },
      {
        id: 2,
        title: "Solo Game",
        titleColor: "white",
        picture: "alone.jpg",
        link: "/solo-game",
      },
      {
        id: 3,
        title: "Watch the AI play",
        titleColor: "white",
        picture: "aiplays.jpg",
        link: "/ai",
      },
    ];

    /**
     * navigates to a route based on the card
     * @param link
     */
    navigateToRoute(link) {
      this.$router.push(link);
    }
  }

  export default Home
</script>
<style scoped>
</style>
