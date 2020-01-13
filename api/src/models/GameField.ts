import {Snake} from "./Snake";
import {Item} from "./Item";
import {Point} from "./Point";
import _ from "lodash";

export class GameField {
  rows: number;
  columns: number;
  item: Item;
  snakes: Snake[];
  area: Point[];

  constructor(item: Item, snakes: Snake[]) {
    this.rows = 20;
    this.columns = 20;
    this.item = item;
    this.snakes = snakes;
    this.area = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.area.push(new Point(i, j));
      }
    }
  }

  update_snakes_blocked_directions(snakes: Snake[], directions: Array<number>) {
    let snakeAteItem = false;
    let allBlocks: Point[] = [];

    snakes.forEach(snake => {
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

      snakes.forEach(otherSnake => {
        if (otherSnake.toString() === snake.toString()) {
          //
        } else {
          otherSnake.blocks.forEach(block => {
            this.update_snake_current_block(snake, block);
          })
        }
      });

      // update the snakes position
      snake.update_snake(directions[snakes.indexOf(snake)], this.item);
    });

    if (snakeAteItem) {
      // check if all fields are blocked
      if (allBlocks.length === (this.rows - 1) * (this.columns - 1)) return true;
      // randomize the item position after it was eaten
      this.item.position.x = Math.round(Math.random() * (this.rows - 1));
      this.item.position.y = Math.round(Math.random() * (this.columns - 1));

      // if the new item position is on a snake block then randomize it again until the item is on a free place
      while (allBlocks.indexOf(this.item.position) !== -1) {
        this.item.position.x = Math.round(Math.random() * (this.rows - 1));
        this.item.position.y = Math.round(Math.random() * (this.columns - 1));
      }
    }

    return false;
  }

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

  isEquivalent(a, b) {
    // Create arrays of property names
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
      return false;
    }

    for (let i = 0; i < aProps.length; i++) {
      let propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }
}
