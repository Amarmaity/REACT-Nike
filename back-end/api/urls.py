from django.urls import path
from . import views

app_name = "api"

urlpatterns = [
    # Define your API endpoints here
    # path('', lambda request: None, name='api-root'),
    path("register/", views.register, name="register"),
    path("login/", views.login, name="login"),
    path("verify-otp/", views.verify_otp, name="verify-otp"),
    path("logout/", views.logout, name="logout"),
    path("refresh/", views.refresh_token, name="refresh"),
    path("get-user/", views.get_user, name="get-user"),
    path("admin-dashboard/", views.admin_dashboard, name="admin-user"),
    path("master-category/", views.add_master_category, name="add-master-category"),
    path("master-category/<int:category_id>/", views.master_category_detail, name="master-category-detail"),
    path("sub-category/", views.add_sub_category, name="add-sub-category"),
    
    path("sub-category/<int:subcategory_id>/", views.subcategory_detail, name="subcategory-detail"),
    path("product/", views.add_product, name="add-product"),
    path("product/<int:product_id>/", views.product_detail, name="product-detail"),
    path("create-customer/", views.create_customer, name="customer-create"),
]
