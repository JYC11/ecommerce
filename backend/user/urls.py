from django.urls import path
from . import views

app_name = "user"

urlpatterns = [
    path("", views.get_users, name="users"),
    path("login/", views.MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("register/", views.register_user, name="register"),
    path("profile/", views.get_user_profile, name="users-profile"),
    path("profile/update/", views.update_user_profile, name="users-profile-update"),
    path("<str:pk>/", views.admin_get_user_by_id, name="admin-get-by-id"),
    path("update/<str:pk>/", views.admin_update_user, name="admin-update"),
    path("delete/<str:pk>/", views.admin_delete_user, name="admin-delete"),
]
