from django.conf.urls import url

from . import views

app_name = 'main'

urlpatterns = [
    url(r'^another/', views.MyOwnView.as_view()),
    url(r'^game-field/', views.GameFieldRest.as_view())
]
