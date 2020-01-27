<template>
  <v-row :dark="state.dark" no-gutters>
    <v-col>
      <v-row no-gutters>
        <h2>Settings:</h2>
      </v-row>
      <v-row no-gutters>
        <v-radio-group :dark="state.dark" v-model="gameFieldSize">
          <template v-slot:label>
            <div>Gamefield size:</div>
          </template>
          <v-radio value="small">
            <template v-slot:label>
              <div>Small (15x15)</div>
            </template>
          </v-radio>
          <v-radio value="medium">
            <template v-slot:label>
              <div>Medium (20x20)</div>
            </template>
          </v-radio>
          <v-radio value="large">
            <template v-slot:label>
              <div>Large (25x25)</div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-row>
      <v-row no-gutters>
        <v-radio-group :dark="state.dark" v-model="gameSpeed">
          <template v-slot:label>
            <div>Game Speed:</div>
          </template>
          <v-radio value="slow">
            <template v-slot:label>
              <div>Slow (400ms refresh rate)</div>
            </template>
          </v-radio>
          <v-radio value="mediocre">
            <template v-slot:label>
              <div>Mediocre (250ms refresh rate)</div>
            </template>
          </v-radio>
          <v-radio value="fast">
            <template v-slot:label>
              <div>Fast (150ms refresh rate)</div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-row>
      <v-row no-gutters>
        <v-btn @click="startGame()" block color="primary" dark>Start Game</v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
  import {Component, Vue, Watch} from 'vue-property-decorator'

  @Component({
    components: {}
  })
  class GameFieldSettings extends Vue {
    gameFieldSize = "medium";
    gameSpeed = "mediocre";
    state = this.$store.state;

    /**
     * connect to the server
     */
    mounted() {
      this.$socket.client.connect();
    }

    /**
     * start the game
     */
    startGame() {
      this.$emit("startGame")
    }

    /**
     * send field size to the parent component
     * @private
     */
    @Watch("gameFieldSize")
    __updateGameFieldSize() {
      this.$socket.client.emit('gameFieldSize', this.gameFieldSize);
      if (this.gameFieldSize === "small") {
        this.$emit("fieldWidth", 300);
        this.$emit("fieldHeight", 300);
      }
      if (this.gameFieldSize === "medium") {
        this.$emit("fieldWidth", 400);
        this.$emit("fieldHeight", 400);
      }
      if (this.gameFieldSize === "large") {
        this.$emit("fieldWidth", 500);
        this.$emit("fieldHeight", 500);
      }
    }

    /**
     * send gamespeed to the server
     * @private
     */
    @Watch("gameSpeed")
    __updateGameSpeed() {
      this.$socket.client.emit('gameSpeed', this.gameSpeed);
    }
  }

  export default GameFieldSettings
</script>
<style scoped>
</style>
