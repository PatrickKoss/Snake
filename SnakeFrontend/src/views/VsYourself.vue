<template>
  <v-row no-gutters>
    <GameContext :mode="''"/>
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
  class VsYourself extends Vue {

  }

  export default VsYourself
</script>
<style scoped>
</style>
