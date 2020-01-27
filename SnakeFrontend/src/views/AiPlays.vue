<template>
  <v-row no-gutters>
    <v-col cols="12" lg="8" md="8" sm="8">
      <v-card
              :dark="state.dark"
              class="pa-2"
              outlined
              tile
      >
        <GameField :fieldHeight="fieldHeight" :fieldWidth="fieldWidth"/>
      </v-card>
    </v-col>
    <v-col cols="12" lg="4" md="4" sm="4" v-show="showSettings">
      <v-card
              :dark="state.dark"
              class="pa-2"
              outlined
              tile
      >
        <GameFieldSettings @fieldHeight="setHeight" @fieldWidth="setWidth" @startGame="startGame"/>
      </v-card>
    </v-col>
    <v-row>
      <v-dialog
              :dark="state.dark"
              max-width="400"
              persistent
              v-model="dialog"
      >
        <v-card :dark="state.dark">
          <v-card-title class="headline">The AI will start playing the game in {{timeoutToStartGame}} seconds
          </v-card-title>

          <v-card-text>
            <h3>Enjoy</h3>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row>
      <v-dialog
              :dark="state.dark"
              max-width="400"
              v-model="dialogGameOver"
      >
        <v-card :dark="state.dark" v-if="userScore.scores">
          <v-card-title class="headline">Game Over</v-card-title>

          <v-card-text style="padding-top: 20px">
            <h3>The AI got {{userScore.scores.score}} points.</h3>
          </v-card-text>
          <v-divider/>
          <v-card-actions>
            <v-spacer/>
            <v-btn @click="dialogGameOver = false" color="primary" text>Alright</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-row>
</template>

<script>
  import {Component, Vue} from 'vue-property-decorator';
  import GameField from "../components/GameField.vue";
  import GameFieldSettings from "../components/GameFieldSettings";
  import GameMechanicsExplanation from "../components/GameMechanicsExplanation";
  import {Socket} from "vue-socket.io-extended";

  @Component({
    components: {
      GameField,
      GameFieldSettings,
      GameMechanicsExplanation
    }
  })
  class AiPlays extends Vue {
    fieldWidth = 400;
    fieldHeight = 400;
    showSettings = true;
    dialog = false;
    timeoutToStartGame = 3;
    dialogGameOver = false;
    userScore = {};
    state = this.$store.state;

    setWidth(width) {
      this.fieldWidth = width;
    }

    setHeight(height) {
      this.fieldHeight = height;
    }

    /**
     * start the game after 3seconds
     */
    startGame() {
      this.dialog = true;
      this.showSettings = false;
      let pointer = this;
      setTimeout(() => {
        pointer.dialog = false;
        this.$socket.client.emit('startGame', "AIAlone");
      }, 3000);

      for (let i = 1; i < this.timeoutToStartGame; i++) {
        setTimeout(() => {
          this.timeoutToStartGame -= 1;
        }, i * 1000)
      }
    }

    /**
     * get the gameover event
     * @param userScore
     */
    @Socket('game-over')
    getGameOver(userScore) {
      this.showSettings = true;
      this.$socket.client.emit('init-game');
      this.timeoutToStartGame = 3;
      this.userScore = userScore;
      this.dialogGameOver = true;
    }
  }

  export default AiPlays
</script>
<style scoped>
</style>
