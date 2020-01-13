<template>
  <v-row no-gutters>
    <div v-if="gameField">
      <div v-for="(card, index) in gameField.area" :key="index" style="position: absolute;">
        <v-card
                width="10px"
                height="10px"
                :style="'top: ' + card.y * 10 + 'px; left: ' + card.x * 10 + 'px;'"
        />
      </div>
      <div v-for="(block, indexBlock) in snakeBlocks" :key="'b' + indexBlock" style="position: absolute;">
        <v-card
                width="10px"
                height="10px"
                :style="'top: ' + block.y * 10 + 'px; left: ' + block.x * 10 + 'px; background-color: ' + block.color"
                @click="test(block)"
        />
      </div>
      <div style="position: absolute;">
        <v-card
                width="10px"
                height="10px"
                :style="'top: ' + gameField.item.position.y * 10 + 'px; left: ' + gameField.item.position.x * 10 + 'px; background-color: ' + itemColor"
        />
      </div>
    </div>
  </v-row>
</template>

<script>
  import {Vue, Component} from 'vue-property-decorator'
  import {Socket} from 'vue-socket.io-extended'

  @Component
  class VsYourself extends Vue {
    gameField = null;
    snakeColors = ["red", "blue", "green"];
    itemColor = "#879F00";
    snakeBlocks = [];

    @Socket('game-field')
    getGameField(gameField) {
      this.gameField = gameField;
      this.snakeBlocks = [];
      for (let i = 0; i < this.gameField.snakes.length; i++) {
        for (let j = 0; j < this.gameField.snakes[i].blocks.length; j++) {
          this.snakeBlocks.push({x: this.gameField.snakes[i].blocks[j].x, y: this.gameField.snakes[i].blocks[j].y, color: this.snakeColors[i]});
        }
      }
      // eslint-disable-next-line no-console
      //console.log(gameField);
    }

    mounted() {
      this.$socket.client.connect();
      this.$socket.client.emit('connected', "connected");
      window.addEventListener('keydown', this.keyDown, false);
    }

    test(index) {
      // eslint-disable-next-line no-console
      console.log(index);
    }

    keyDown(e) {
      this.$socket.client.emit(e.key, e.key);
    }

    beforeDestroy() {
      window.removeEventListener("keydown", this.keyDown, false);
      this.$socket.client.disconnect();
    }
  }

  export default VsYourself
</script>
<style scoped>
</style>
