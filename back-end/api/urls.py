from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    # Define your API endpoints here
    # path('', lambda request: None, name='api-root'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('verify-otp/', views.verify_otp, name='verify-otp'),
    path('logout/', views.logout, name='logout'),
    path('refresh/', views.refresh_token, name='refresh'),
    path('get-user/', views.get_user, name='get-user'),
    path('admin-dashboard/', views.admin_dashboard, name='admin-user'),
]
