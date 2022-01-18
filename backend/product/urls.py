from django.urls import path, include
from . import views

urlpatterns = [
    path("", views.getProducts, name="getProducts"),
    path("<str:pk>/", views.getProduct, name="getProduct"),
]
