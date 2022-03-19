from django.urls import path, include
from . import views

app_name = "order"

urlpatterns = [
    path("add/", views.addOrderItems, name="orders-add"),
    path("myorders/", views.getMyOrders, name="my-orders"),
    path("<str:pk>/", views.getOrderById, name="user-order"),
    path("<str:pk>/pay/", views.updateOrderToPaid, name="pay"),
    path("<str:pk>/deliver/", views.updateOrderToDelivered, name="deliver"),
]
