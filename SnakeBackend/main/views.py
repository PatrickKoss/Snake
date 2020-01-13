from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from rest_framework import permissions
from rest_framework import serializers
from main.utils.GameField import GameField
from main.utils.Snake import Snake
from main.utils.Item import Item
from main.utils.Point import Point
import json


class MyOwnView(APIView):
    def get(self, request):
        return Response([{"likes": 10, "comments": 0}, {"likes": 4, "comments": 23}])


class GameFieldRest(APIView):
    def get(self, request):
        snake = Snake(20, 37, 0)
        game_field = GameField(Item(Point(20, 2)), [snake])
        json_rep = json.dumps(game_field.repr_json(), cls=ComplexEncoder)
        json_rep = json.loads(json_rep)
        return Response(json_rep)


class ComplexEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, 'repr_json'):
            return obj.repr_json()
        else:
            return json.JSONEncoder.default(self, obj)
