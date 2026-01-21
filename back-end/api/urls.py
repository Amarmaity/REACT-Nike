from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    # Define your API endpoints here
    # path('', lambda request: None, name='api-root'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
]
