from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class SnakeCategories(models.Model):
    category = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Categories"


class Scoreboard(models.Model):
    score = models.PositiveIntegerField()
    category = models.ForeignKey(SnakeCategories, default=1, verbose_name="Categories", on_delete=models.CASCADE)
    user = models.ForeignKey(User, default=1, verbose_name="User", on_delete=models.CASCADE)
