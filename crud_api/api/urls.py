from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    ProductCreateView,
    ProductEditView,
    ProductListView,
    ProfileView,
    # UserDetailView,
    create_user,
    delete_account,
    logout,
    update_password,
    update_username,
)

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("delete-account/", delete_account, name="delete_account"),
    path("logout/", logout, name="logout"),
    path("update-username/", update_username, name="update_username"),
    path("update-password/", update_password, name="update_password"),
    path("create-user/", create_user, name="create_user"),
    path("create-product/", ProductCreateView.as_view(), name="product_create"),
    path("list-products/", ProductListView.as_view(), name="product_list"),
    path("edit-product/<int:pk>/", ProductEditView.as_view(), name="product_edit"),
    # path("detail-user/<int:pk>/", UserDetailView.as_view(), name="product_detail"),
]
