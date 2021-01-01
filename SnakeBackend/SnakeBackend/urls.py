from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

urlpatterns = [
                  path('admin/', admin.site.urls),
                  url(r'^api-auth/', include('rest_framework.urls')),
                  path("main/", include('main.urls')),
                  path("user/", include('user.urls')),
                  path("leaderboard/", include('leaderboard.urls')),
              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
