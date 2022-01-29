from django.urls import path, include
from . import views

app_name = "product"

urlpatterns = [
    path("", views.getProducts, name="getProducts"),
    path("<str:pk>/", views.getProduct, name="getProduct"),
]
