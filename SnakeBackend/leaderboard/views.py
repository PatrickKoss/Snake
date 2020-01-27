import json

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from user.utils.Message import Message
from .models import Scoreboard, SnakeCategories


# creates a score in the database
class CreateScore(APIView):
    def post(self, request):
        data = json.loads(request.body)
        response = {}
        user = None
        # check if the user is authenticated. Has a token.
        try:
            user = Token.objects.get(key=request.headers.get('Authorization'))
        except Token.DoesNotExist:
            print(Token.DoesNotExist)
        message = Message("success", f"Successfully created score")
        if user is not None:
            # check if the send category is valid (needs to exists in the database)
            if SnakeCategories.objects.filter(category=data["category"]).exists():
                # check if the score is valid
                if 0 <= data["score"] <= 900:
                    # create the score in the database
                    # first get the category object
                    category = SnakeCategories.objects.get(category=data["category"])
                    # get the user
                    user = User.objects.get(username=user.user)
                    # finally create the score
                    score = Scoreboard.objects.create(user=user, category=category, score=data["score"])

                    # get all user scores
                    user_scoreboard = Scoreboard.objects.filter(user=user, category=category)
                    # get all scores
                    global_scoreboard = Scoreboard.objects.filter(category=category)
                    # get the user personal ranking
                    user_leaderboard = []
                    for user_score in user_scoreboard:
                        d = ScoreboardSerializer(user_score).data
                        user_leaderboard.append(d["score"])
                    list_scores_smaller_score_user = [val for idx, val in enumerate(user_leaderboard) if
                                                      val < data["score"]]
                    ranking_of_score_user = len(user_leaderboard) - len(list_scores_smaller_score_user)

                    # get global ranking
                    global_leaderboard = []
                    for global_score in global_scoreboard:
                        d = ScoreboardSerializer(global_score).data
                        global_leaderboard.append(d["score"])
                    list_scores_smaller_score_global = [val for idx, val in enumerate(global_leaderboard) if
                                                        val < data["score"]]
                    ranking_of_score_global = len(global_leaderboard) - len(list_scores_smaller_score_global)

                    response = {"message": message.repr_json(), "scores": {"userRanking": ranking_of_score_user,
                                                                           "globalRanking": ranking_of_score_global,
                                                                           "score": data["score"]}}
            else:
                message = Message("error", f"Mode is not valid")
                response = {"message": message.repr_json()}
        else:
            message = Message("error", f"Authentication failed")
            response = {"message": message.repr_json()}
        json_rep = json.dumps(response, cls=ComplexEncoder)
        json_rep = json.loads(json_rep)
        return Response(json_rep)


# returns a scoreboard
class GetScoreboard(APIView):
    def get(self, request):
        response = {}
        scoreboard = Scoreboard.objects.all()
        # if the category is in the params filter scores according to the category
        # first check if the category is valid
        category = SnakeCategories.objects.get(category=self.request.query_params['category'])
        if category is not None:
            if 'category' in self.request.query_params:
                scoreboard = Scoreboard.objects.filter(category__category=self.request.query_params['category'])
            message = Message("success", f"Successfully loaded leaderboard")
            leaderboard = []
            # serialize each score of the scoreboard
            for score in scoreboard:
                data = ScoreboardSerializer(score).data
                leaderboard.append(
                    {"score": data["score"], "username": data["user"]["username"],
                     "category": data["category"]["category"]})

            leaderboard.sort(key=sort_score, reverse=True)
            # give back only the first 500 scores
            leaderboard = leaderboard[:500]
            response = {"message": message.repr_json(), "leaderboard": leaderboard}
        else:
            message = Message("error", f"Category is not valid")
            response = {"message": message.repr_json()}
        json_rep = json.dumps(response, cls=ComplexEncoder)
        json_rep = json.loads(json_rep)
        return Response(json_rep)


# complex encoder needed for the complex object message
class ComplexEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, 'repr_json'):
            return obj.repr_json()
        else:
            return json.JSONEncoder.default(self, obj)


# user serializer
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']


# snake category serializer
class SnakeCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SnakeCategories
        fields = ['category']


# scoreboard serializer
class ScoreboardSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    category = SnakeCategorySerializer()

    class Meta:
        model = Scoreboard
        fields = ['user', 'score', 'category']


# sorting function
def sort_score(val):
    return val['score']
