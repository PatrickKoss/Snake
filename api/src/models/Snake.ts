import {Point} from "./Point";
import {Item} from "./Item";

/**
 * Snake class
 */
export class Snake {
  angleToItem: number;
  distanceToItem: number;
  blocks: Point[];
  current_direction: number;
  current_direction_top_blocked: number;
  current_direction_right_blocked: number;
  current_direction_bottom_blocked: number;
  current_direction_left_blocked: number;
  id: number;

  /**
   * constructor for initialising the snake
   * @param start_x
   * @param start_y
   * @param start_direction
   * @param id
   */
  constructor(start_x: number, start_y: number, start_direction: number, id: number) {
    this.angleToItem = 0;
    this.distanceToItem = 0;
    this.blocks = [];
    this.current_direction = start_direction;
    this.current_direction_top_blocked = -1;
    this.current_direction_right_blocked = -1;
    this.current_direction_bottom_blocked = -1;
    this.current_direction_left_blocked = -1;
    this.id = id;
    this.blocks.push(new Point(start_x, start_y));
    this.blocks.push(this.switch_init_second_block(start_x, start_y, start_direction));
  }

  /**
   * helper method to set the second blocked of a snake based on the current direction of the snake.
   * @param x
   * @param y
   * @param direction
   */
  switch_init_second_block(x, y, direction) {
    // top, right, bottom, left
    switch (direction) {
      case 0:
        return new Point(x, y + 1);
      case 1:
        return new Point(x - 1, y);
      case 2:
        return new Point(x, y - 1);
      case 3:
        return new Point(x + 1, y);
    }
  }

  /**
   * for the ai it is important to get the snakes angle between the snake and the item and the x axis. Also the
   * distance to the item is a useful feature for predictions. This will not influence the game.
   * @param item
   */
  update_item_props(item: Item) {
    this.angleToItem = (Math.atan2(item.position.y - this.blocks[0].y, item.position.x - this.blocks[0].x)) * (180 / Math.PI);
    this.distanceToItem = Math.sqrt((item.position.x - this.blocks[0].x) ** 2 + (item.position.y - this.blocks[0].y) ** 2);
  }

  /**
   * this method updates the current position of the head.
   * @param direction
   * @param head
   */
  update_head(this, direction, head) {
    // top, right, bottom, left
    switch (direction) {
      case 0:
        return new Point(head.x, head.y - 1);
      case 1:
        return new Point(head.x + 1, head.y);
      case 2:
        return new Point(head.x, head.y + 1);
      case 3:
        return new Point(head.x - 1, head.y);
    }
  }

  /**
   * updates the snake and return false if the snake is crushed and true if everything is ok
   * @param direction
   * @param item
   */
  update_snake(direction: number, item: Item) {
    // check if the selected direction is on the opposite of the current direction. If so the set the selected
    // direction to the current direction
    if (Math.abs(this.current_direction - direction) === 2) {
      direction = this.current_direction;
    }
    if (direction === 0 && this.current_direction_top_blocked === 1) {
      return true
    }
    if (direction === 1 && this.current_direction_right_blocked === 1) {
      return true;
    }
    if (direction === 2 && this.current_direction_bottom_blocked === 1) {
      return true;
    }
    if (direction === 3 && this.current_direction_left_blocked == 1) {
      return true;
    }

    // eat the item if coordinates of head and item are the same
    if (item.position.x === this.blocks[0].x && item.position.y === this.blocks[0].y) {
      this.blocks.push(this.blocks[this.blocks.length - 1]);
    }

    this.update_item_props(item);
    let blocksBeforeUpdated = this.blocks.slice(0);
    for (let i = 0; i < this.blocks.length; i++) {
      if (i === 0) continue;
      // check if the item is eaten and then don´t move the block
      if (item.position.x === this.blocks[0].x && item.position.y === this.blocks[0].y && i === this.blocks.length - 1) continue;
      this.blocks[i] = blocksBeforeUpdated[i - 1];
    }

    // update head
    this.blocks[0] = this.update_head(direction, this.blocks[0]);
    this.current_direction = direction;

    return false;
  }
}
