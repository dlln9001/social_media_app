from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from . import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('user_authentication.api.urls')),
    path('', TemplateView.as_view(template_name='index.html')),
    path('profile/', include('profile_app.api.urls')),
    path('search/', include('search.api.urls')),
    path('post/', include('create_post.api.urls')),
    path('settings/', include('user_settings.api.urls')),
    path('home/', include('home_page.api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
