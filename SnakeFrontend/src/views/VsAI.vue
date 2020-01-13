<template>
  <v-row no-gutters>

  </v-row>
</template>

<script>
  import {Vue, Component} from 'vue-property-decorator'
  import { Socket } from 'vue-socket.io-extended'

  @Component
  class VsAI extends Vue {
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
      // eslint-disable-next-line no-console
      console.log(e.key);
      this.$socket.client.emit(e.key, e.key);
    }

    beforeDestroy() {
      window.removeEventListener("keydown", this.keyDown, false);
      this.$socket.client.disconnect();
    }
  }

  export default VsAI
</script>
<style scoped>
</style>
