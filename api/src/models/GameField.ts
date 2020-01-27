import {Snake} from "./Snake";
import {Item} from "./Item";
import {Point} from "./Point";
import {SnakeRestClient} from "./SnakeRestClient";

export class GameField {
  rows: number;
  columns: number;
  item: Item;
  snakes: Snake[];
  area: Point[];

  /**
   * constructor for init the gamefield
   * @param directions
   * @param rows
   * @param columns
   */
  constructor(directions: number[], rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;
    this.item = new Item(new Point(Math.floor(this.rows / 2), Math.round(this.columns / 2)));
    this.snakes = [];
    let id = 0;
    directions.forEach(direction => {
      if (direction === 0) {
        this.snakes.push(new Snake(Math.floor(this.rows / 2), this.columns - 3, direction, id));
        id++;
      }
      if (direction === 1) {
        this.snakes.push(new Snake(this.rows - 3, Math.floor(this.columns / 2), direction, id));
        id++;
      }
      if (direction === 2) {
        this.snakes.push(new Snake(Math.floor(this.rows / 2), 2, direction, id));
        id++;
      }
      if (direction === 3) {
        this.snakes.push(new Snake(3, Math.floor(this.columns / 2), direction, id));
        id++;
      }
    });
    this.area = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.area.push(new Point(i, j));
      }
    }
  }

  /**
   * updates the snake blocked directions, check if a item was eaten and set the direction of the snake based on all
   * other snakes.
   * @param directions
   * @param mode
   */
  async update_snakes_blocked_directions(directions: Array<number>, mode = "") {
    let snakeData = {};
    // for auto collection snake data for building the ai getting the user input is necessary. This does not influence
    // the game.
    this.snakes.forEach(snake => {
      snakeData = {
        angleToItem: snake.angleToItem,
        distanceToItem: snake.distanceToItem,
        current_direction: snake.current_direction,
        current_direction_top_blocked: snake.current_direction_top_blocked,
        current_direction_right_blocked: snake.current_direction_right_blocked,
        current_direction_bottom_blocked: snake.current_direction_bottom_blocked,
        current_direction_left_blocked: snake.current_direction_left_blocked,
        direction: directions[this.snakes.indexOf(snake)]
      };
    });
    let snakeAteItem = false;
    let allBlocks: Point[] = [];
    let gameover = [];
    directions.forEach(() => gameover.push(false));

    // update the blocked directions
    for (let snake of this.snakes) {
      // first assume the every direction is not blocked and then check it.
      snake.current_direction_top_blocked = -1;
      snake.current_direction_right_blocked = -1;
      snake.current_direction_bottom_blocked = -1;
      snake.current_direction_left_blocked = -1;

      // check if the head will be out of bounds when it would change the direction
      if (snake.blocks[0].x === 0) {
        snake.current_direction_left_blocked = 1;
      }
      if (snake.blocks[0].x === this.rows - 1) {
        snake.current_direction_right_blocked = 1;
      }
      if (snake.blocks[0].y === 0) {
        snake.current_direction_top_blocked = 1;
      }
      if (snake.blocks[0].y === this.columns - 1) {
        snake.current_direction_bottom_blocked = 1;
      }

      // check if the snake has eaten the item
      if (this.item.position.x === snake.blocks[0].x && this.item.position.y === snake.blocks[0].y) {
        snakeAteItem = true;
      }

      for (let j = 0; j < snake.blocks.length; j++) {
        allBlocks.push(snake.blocks[j]);
        if (j === 0) continue;
        this.update_snake_current_block(snake, snake.blocks[j]);
      }

      this.snakes.forEach(otherSnake => {
        if (otherSnake.id === snake.id) {
          //
        } else {
          otherSnake.blocks.forEach(block => {
            this.update_snake_current_block(snake, block);
          })
        }
      });

      // if the ai is involved then get the prediction of the ai
      if (mode === "AIAlone") {
        let res = await SnakeRestClient.predictSnakeDirection({
          angleToItem: snake.angleToItem,
          distanceToItem: snake.distanceToItem,
          current_direction: snake.current_direction,
          current_direction_top_blocked: snake.current_direction_top_blocked,
          current_direction_right_blocked: snake.current_direction_right_blocked,
          current_direction_bottom_blocked: snake.current_direction_bottom_blocked,
          current_direction_left_blocked: snake.current_direction_left_blocked
        });
        directions[this.snakes.indexOf(snake)] = Math.abs(Math.round(res.data.direction));
      }

      if (mode === "VsAI") {
        let res = await SnakeRestClient.predictSnakeDirection({
          angleToItem: snake.angleToItem,
          distanceToItem: snake.distanceToItem,
          current_direction: snake.current_direction,
          current_direction_top_blocked: snake.current_direction_top_blocked,
          current_direction_right_blocked: snake.current_direction_right_blocked,
          current_direction_bottom_blocked: snake.current_direction_bottom_blocked,
          current_direction_left_blocked: snake.current_direction_left_blocked
        });
        directions[1] = Math.abs(Math.round(res.data.direction));
      }
      // update the snakes position
      gameover[this.snakes.indexOf(snake)] = snake.update_snake(directions[this.snakes.indexOf(snake)], this.item);

      // create data for prediction
      /*      if (!gameover[snakes.indexOf(snake)]) {
              SnakeRestClient.sendSnakeData(snakeData).then(r => r).catch(e => console.log(e));
            }*/
    }

    // update the item if the snake ate the item. Just set the item to an empty field.
    if (snakeAteItem) {
      // check if all fields are blocked
      if (allBlocks.length === (this.rows - 1) * (this.columns - 1)) gameover = gameover.map(val => true);
      // randomize the item position after it was eaten
      this.item.position.x = Math.round(Math.random() * (this.rows - 1));
      this.item.position.y = Math.round(Math.random() * (this.columns - 1));

      // if the new item position is on a snake block then randomize it again until the item is on a free place
      while (allBlocks.findIndex(block => {
        return this.item.position.x === block.x && this.item.position.y === block.y
      }) !== -1) {
        this.item.position.x = Math.round(Math.random() * (this.rows - 1));
        this.item.position.y = Math.round(Math.random() * (this.columns - 1));
      }
    }

    return gameover;
  }

  /**
   * helper method for updating a snakes blocked direction
   * @param snake
   * @param block
   */
  update_snake_current_block(snake: Snake, block: Point) {
    if (snake.blocks[0].x === block.x + 1 && snake.blocks[0].y === block.y) {
      snake.current_direction_left_blocked = 1;
    }
    if (snake.blocks[0].x === block.x - 1 && snake.blocks[0].y === block.y) {
      snake.current_direction_right_blocked = 1;
    }
    if (snake.blocks[0].x === block.x && snake.blocks[0].y === block.y - 1) {
      snake.current_direction_bottom_blocked = 1;
    }
    if (snake.blocks[0].x === block.x && snake.blocks[0].y === block.y + 1) {
      snake.current_direction_top_blocked = 1;
    }
  }
}
