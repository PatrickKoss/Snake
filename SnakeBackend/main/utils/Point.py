class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def repr_json(self):
        return dict(x=self.x, y=self.y)
