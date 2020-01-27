from django.conf.urls import url

from . import views

app_name = 'leaderboard'

urlpatterns = [
    url(r'^create-score/', views.CreateScore.as_view()),
    url(r'^get-scoreboard/', views.GetScoreboard.as_view()),
]
