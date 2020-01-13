class Item:
    def __init__(self, point):
        self.position = point

    def repr_json(self):
        return dict(position=self.position)
