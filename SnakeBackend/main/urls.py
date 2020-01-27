from django.conf.urls import url

from . import views

app_name = 'main'

urlpatterns = [
    url(r'^send-snake-data/', views.SendSnakeData.as_view()),
    url(r'^predict-snake-direction/', views.PredictSnakeDirection.as_view()),
]
