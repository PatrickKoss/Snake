<template>
  <v-row no-gutters>

  </v-row>
</template>

<script>
  import {Vue, Component} from 'vue-property-decorator'
  import { Socket } from 'vue-socket.io-extended'

  @Component
  class AiPlays extends Vue {
    @Socket('clicked')  // --> listens to the event with given name, e.g. `tweet`
    clicked (message) {
      // eslint-disable-next-line no-console
      console.log(message);
    }

    mounted() {
      this.$socket.client.connect();
      this.$socket.client.emit('connected', "connected");
      window.addEventListener('keydown', this.keyDown, false);
    }

    keyDown(e) {
      this.$socket.client.emit(e.key, e.key);
    }

    beforeDestroy() {
      window.removeEventListener("keydown", this.keyDown, false);
      this.$socket.client.disconnect();
    }
  }

  export default AiPlays
</script>
<style scoped>
</style>
