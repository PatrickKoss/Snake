import json
import os
import pickle
import random

import numpy as np
import pandas as pd
from rest_framework.response import Response
from rest_framework.views import APIView

from SnakeBackend.settings import STATIC_ROOT, BASE_DIR


# saving learning data in a csv file
class SendSnakeData(APIView):
    def post(self, request):
        data = json.loads(request.body)
        csv = os.path.join(STATIC_ROOT, 'main/data/snakeData.csv')
        df = pd.read_csv(csv, encoding="utf-8", error_bad_lines=False)
        df = df.append(
            {"angleToItem": round(data["angleToItem"], 2), "distanceToItem": round(data["distanceToItem"], 2),
             "current_direction": data["current_direction"],
             "current_direction_top_blocked": data["current_direction_top_blocked"],
             "current_direction_right_blocked": data["current_direction_right_blocked"],
             "current_direction_bottom_blocked": data["current_direction_bottom_blocked"],
             "current_direction_left_blocked": data["current_direction_left_blocked"],
             "direction": data["direction"]}, ignore_index=True)
        export_csv = df.to_csv(r'' + csv, index=None, header=True)
        return Response({"ok": "ok"})


# predict a direction of a snake
class PredictSnakeDirection(APIView):
    def post(self, request):
        data = json.loads(request.body)
        module_dir = os.path.dirname(__file__)
        # testing out different classifier. KNeighbors seem to work best
        print("before filename specified")
        filename = os.path.join(BASE_DIR, 'main/models/LinearRegressionClassifier.sav')
        filename_KNeighbors = os.path.join(BASE_DIR, 'main/models/KNeighborsClassifier.sav')
        filename_SVM = os.path.join(BASE_DIR, 'main/models/SVMClassifier.sav')
        print("before classifier init")
        print("file name k neightbors: " + filename_KNeighbors)
        clf_KNeighbors = ""
        try:
            clf_KNeighbors = pickle.load(open(filename_KNeighbors, 'rb'))
        except BaseException as e:
            print(str(e))
        print("opened k neighbors")
        try:
            clf = pickle.load(open(filename, 'rb'))
        except Exception:
            print(Exception)
        print("opened k lin")
        try:
            clf_SVM = pickle.load(open(filename_SVM, 'rb'))
        except Exception as e:
            print(str(e))
        print("opened k svm")
        print("after classifier init")
        current_direction = data["current_direction"]
        # catch errors
        print("before current direction is none")
        if current_direction is None:
            current_direction = 0
        prediction_data = np.array([[round(data["angleToItem"], 2), round(data["distanceToItem"], 2),
                                     current_direction, data["current_direction_top_blocked"],
                                     data["current_direction_right_blocked"], data["current_direction_bottom_blocked"],
                                     data["current_direction_left_blocked"]]])
        print("after prediction data preparation")
        prediction_data = prediction_data.reshape(len(prediction_data), -1)
        direction = 0
        try:
            # direction = clf.predict(prediction_data)
            # print("after clf linear")
            direction = clf_KNeighbors.predict(prediction_data)
            print("after clf k neighbors predict")
            # direction = clf_SVM.predict(prediction_data)
            # print("after clf svm neighbors predict")
            direction = round(direction[0])
        except Exception as e:
            print(e)
        print("direction: " + str(direction))

        # if the predicted direction is going to a blocked direction then randomize the direction
        counter = 0
        while (data['current_direction_top_blocked'] == 1 and direction == 0 or data[
            'current_direction_right_blocked'] == 1 and direction == 1 or data[
                   'current_direction_bottom_blocked'] == 1 and direction == 2 or data[
                   'current_direction_left_blocked'] == 1 and direction == 3):
            direction = random.randrange(0, 4, 1)
            counter += 1
            # to avoid infinite loop give up after some loops
            if counter == 500:
                break
        print(direction)
        return Response({"direction": direction})
