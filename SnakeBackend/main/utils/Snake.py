import math

from .Point import Point


class Snake:
    def __init__(self, start_x, start_y, start_direction):
        self.angleToItem = 0
        self.distanceToItem = 0
        self.blocks = []
        self.direction = start_direction
        self.current_direction = start_direction
        self.current_direction_top_blocked = -1
        self.current_direction_right_blocked = -1
        self.current_direction_bottom_blocked = -1
        self.current_direction_left_blocked = -1
        self.blocks.append(Point(start_x, start_y))
        self.blocks.append(self.switch_init_second_block(start_x, start_y, start_direction))

    def switch_init_second_block(self, x, y, direction):
        # top, right, bottom, left
        switcher = {0: Point(x, y + 1), 1: Point(x - 1, y), 2: Point(x, y - 1), 3: Point(x + 1, y)}
        return switcher.get(direction, Point(x, y))

    def update_item_props(self, item):
        self.angleToItem = math.degrees(math.atan2(item.y - self.blocks[0].y, item.x - self.blocks[0].x))
        self.distanceToItem = math.sqrt((item.x - self.blocks[0].x) ** 2 + (item.y - self.blocks[0].y) ** 2)

    def update_head(self, direction, head):
        # top, right, bottom, left
        switcher = {0: Point(head.x, head.y - 1), 1: Point(head.x + 1, head.y), 2: Point(head.x, head.y + 1),
                    3: Point(head.x - 1, head.y)}
        return switcher.get(direction, Point(head.x, head.y))

    # updates the snake and return false if the snake is crushed and true if everything is ok
    def update_snake(self, direction, item):
        # check if the direction we are heading to is blocked.
        # if it is blocked then return false
        if self.current_direction_top_blocked == 1 or self.current_direction_right_blocked == 1 or \
          self.current_direction_bottom_blocked == 1 or self.current_direction_left_blocked == 1:
            return False
        # check if the selected direction is on the opposite of the current direction. If so the set the selected
        # direction to the current direction
        if abs(self.current_direction - direction) == 2:
            direction = self.current_direction
        if direction == 0 and self.current_direction_top_blocked == 1:
            return False
        if direction == 1 and self.current_direction_right_blocked == 1:
            return False
        if direction == 2 and self.current_direction_bottom_blocked == 1:
            return False
        if direction == 3 and self.current_direction_left_blocked == 1:
            return False
        self.update_item_props(item)
        for i in range(len(self.blocks)):
            if i == 0:
                continue
            self.blocks[i] = self.blocks[i - 1]

        self.blocks[0] = self.update_head(direction)
        self.current_direction = direction
        return True

    def repr_json(self):
        return dict(angleToItem=self.angleToItem, distanceToItem=self.distanceToItem, blocks=self.blocks,
                    direction=self.direction, current_direction=self.current_direction,
                    current_direction_top_blocked=self.current_direction_top_blocked,
                    current_direction_right_blocked=self.current_direction_right_blocked,
                    current_direction_bottom_blocked=self.current_direction_bottom_blocked,
                    current_direction_left_blocked=self.current_direction_left_blocked)
