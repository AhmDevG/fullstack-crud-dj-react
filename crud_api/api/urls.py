from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from .views import ProfileView , delete_account , logout , update_username , update_password

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('delete-account/', delete_account, name='delete_account'),
    path('logout/', logout, name='logout'),
    path('update-username/', update_username, name='update_username'),
    path('update-password/', update_password, name='update_password'),
]

