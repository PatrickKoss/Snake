<template>
  <v-row no-gutters>
    <GameContext :mode="'VsAI'"/>
  </v-row>
</template>

<script>
  import {Component, Vue} from 'vue-property-decorator';
  import GameContext from "../components/GameContext";

  @Component({
    components: {
      GameContext
    }
  })
  class VsAI extends Vue {
    /**
     * the the game mode on server side to vsAI
     */
    mounted() {
      this.$socket.client.emit('vsAI');
    }
  }

  export default VsAI
</script>
<style scoped>
</style>
