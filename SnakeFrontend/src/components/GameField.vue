<template>
  <v-row no-gutters>
    <div v-if="gameField">
      <div :style="'position: relative; width:' + fieldWidth +  'px; height:' + fieldHeight + 'px'">
        <div :key="index" style="position: absolute;" v-for="(card, index) in gameField.area">
          <v-card
                  :style="'top: ' + card.y * 20 + 'px; left: ' + card.x * 20 + 'px;'"
                  height="20px"
                  v-bind:class="{ darkening: state.dark}"
                  width="20px"
          />
        </div>
        <div :key="'b' + indexBlock" style="position: absolute;" v-for="(block, indexBlock) in snakeBlocks">
          <v-card
                  :style="'top: ' + block.y * 20 + 'px; left: ' + block.x * 20 + 'px; background-color: ' + block.color"
                  height="20px"
                  width="20px"
          />
        </div>
        <div style="position: absolute;">
          <v-card
                  :style="'top: ' + item.position.y * 20 + 'px; left: ' + item.position.x * 20 + 'px; background-color: ' + itemColor"
                  height="20px"
                  width="20px"
          />
        </div>
      </div>

    </div>
  </v-row>
</template>

<script>
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {Socket} from 'vue-socket.io-extended'

  @Component
  class GameField extends Vue {
    gameField = null;
    snakeColors = ["red", "blue", "green", "black"];
    itemColor = "#879F00";
    snakeBlocks = [];
    item = {};
    state = this.$store.state;

    @Prop() fieldWidth;
    @Prop() fieldHeight;

    /**
     * get the game field form the server
     * @param gameField
     */
    @Socket('game-field')
    getGameField(gameField) {
      console.log(gameField);
      this.gameField = gameField;
      this.snakeBlocks = [];
      for (let i = 0; i < this.gameField.snakes.length; i++) {
        for (let j = 0; j < this.gameField.snakes[i].blocks.length; j++) {
          this.snakeBlocks.push({
            x: this.gameField.snakes[i].blocks[j].x,
            y: this.gameField.snakes[i].blocks[j].y,
            color: this.snakeColors[i]
          });
        }
      }
      this.item = gameField.item;
    }

    /**
     * get the updated snakes and item from the server
     * @param snakesAndItem
     */
    @Socket('updated-snakes')
    getSnakesAndItem(snakesAndItem) {
      this.snakeBlocks = [];
      for (let i = 0; i < snakesAndItem.snakes.length; i++) {
        for (let j = 0; j < snakesAndItem.snakes[i].blocks.length; j++) {
          this.snakeBlocks.push({
            x: snakesAndItem.snakes[i].blocks[j].x,
            y: snakesAndItem.snakes[i].blocks[j].y,
            color: this.snakeColors[i]
          });
        }
      }
      this.item = snakesAndItem.item;
    }

    /**
     * connect to the server and send init game event
     */
    mounted() {
      this.$socket.client.connect();
      console.log("in game field");
      // send the token
      this.$socket.client.emit('connected', this.state.token);
      window.addEventListener('keydown', this.keyDown, false);
      this.$socket.client.emit('init-game');
    }

    /**
     * the key to the backend to set direction of the snake
     * @param e
     */
    keyDown(e) {
      this.$socket.client.emit(e.key, e.key);
    }

    /**
     * if a user is logged in then send his token to the server. Needed for creating his score.
     */
    @Watch("state.token", {immediate: true, deep: true})
    __updateUser() {
      // send the token
      this.$socket.client.emit('connected', this.state.token);
    }

    /**
     * clean up logic
     */
    beforeDestroy() {
      window.removeEventListener("keydown", this.keyDown, false);
      this.$socket.client.disconnect();
    }
  }

  export default GameField
</script>
<style scoped>
  .darkening {
    background-color: #262626;
  }
</style>
