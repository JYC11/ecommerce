from django.urls import path, include
from . import views

app_name = "order"

urlpatterns = [
    path("add/", views.addOrderItems, name="orders-add"),
]
