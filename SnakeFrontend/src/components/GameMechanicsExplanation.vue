<template>
  <v-row :dark="state.dark" no-gutters>
    <v-col>
      <v-row no-gutters>
        <h2>Use your arrow keys on your keyboard or the buttons below</h2>
      </v-row>
      <v-row no-gutters>
        <v-spacer/>
        <v-btn @click="setDirection('ArrowUp')" color="primary" icon text>
          <v-icon>mdi-arrow-up-circle-outline</v-icon>
        </v-btn>
        <v-spacer/>
      </v-row>
      <v-row no-gutters>
        <v-spacer/>
        <v-btn @click="setDirection('ArrowLeft')" color="primary" icon text>
          <v-icon>mdi-arrow-left-circle-outline</v-icon>
        </v-btn>
        <v-btn @click="setDirection('ArrowDown')" color="primary" icon text>
          <v-icon>mdi-arrow-down-circle-outline</v-icon>
        </v-btn>
        <v-btn @click="setDirection('ArrowRight')" color="primary" icon text>
          <v-icon>mdi-arrow-right-circle-outline</v-icon>
        </v-btn>
        <v-spacer/>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
  import {Component, Vue} from 'vue-property-decorator'

  @Component({
    components: {}
  })
  class GameMechanicsExplanation extends Vue {
    state = this.$store.state;

    /**
     * set the direction of the snake based on the button clicked.
     * @param value
     */
    setDirection(value) {
      this.$socket.client.emit(value, value);
    }
  }

  export default GameMechanicsExplanation
</script>
<style scoped>
</style>
