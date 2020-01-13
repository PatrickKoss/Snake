from .Point import Point


class GameField:
    def __init__(self, item, snakes):
        self.rows = 40
        self.columns = 40
        self.item = item
        self.snakes = snakes
        self.area = []
        for row in range(self.rows):
            for column in range(self.columns):
                self.area.append(Point(row, column))

    def update_snakes_blocked_directions(self, snakes):
        for index, snake in enumerate(snakes):
            # check if the head will be out of bounds when it would change the direction
            if snake.blocks[0].x == 0:
                snake.current_direction_left_blocked = 1
            if snake.blocks[0].x == self.rows - 1:
                snake.current_direction_right_blocked = 1
            if snake.blocks[0].y == 0:
                snake.current_direction_top_blocked = 1
            if snake.blocks[0].y == self.columns - 1:
                snake.current_direction_bottom_blocked = 1

            # check if the snake would crush with other snakes or itself
            # first check its own blocks
            for i, block in enumerate(snake.blocks):
                if i == 0:
                    continue
                self.update_snake_current_block(snake, block)

            # finally check the other snakes
            for otherSnake in snakes:
                # if it is the same snake then continue
                if snake == otherSnake:
                    continue
                for block in otherSnake.blocks:
                    self.update_snake_current_block(snake, block)

    def update_snake_current_block(self, snake, block):
        if snake.blocks[0].x == block.x + 1 and snake.blocks[0].y == block.y:
            snake.current_direction_left_blocked = 1
        if snake.blocks[0].x == block.x - 1 and snake.blocks[0].y == block.y:
            snake.current_direction_right_blocked = 1
        if snake.blocks[0].y == block.y - 1 and snake.blocks[0].x == block.x:
            snake.current_direction_top_blocked = 1
        if snake.blocks[0].y == block.y + 1 and snake.blocks[0].x == block.x:
            snake.current_direction_bottom_blocked = 1

    def repr_json(self):
        return dict(rows=self.rows, columns=self.columns, item=self.item, snakes=self.snakes, area=self.area)
