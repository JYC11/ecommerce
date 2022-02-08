from django.urls import path
from . import views

app_name = "user"

urlpatterns = [
    path("", views.getUsers, name="users"),
    path("login/", views.MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("register/", views.registerUser, name="register"),
    path("profile/", views.getUserProfile, name="users-profile"),
    path("profile/update/", views.updateUserProfile, name="users-profile-update"),
]
