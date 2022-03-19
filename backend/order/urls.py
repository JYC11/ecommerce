from django.urls import path, include
from . import views

app_name = "order"

urlpatterns = [
    path("add/", views.add_order_items, name="orders-add"),
    path("myorders/", views.get_my_orders, name="my-orders"),
    path("<str:pk>/", views.get_order_by_id, name="user-order"),
    path("<str:pk>/pay/", views.update_order_to_paid, name="pay"),
    path("<str:pk>/deliver/", views.update_order_to_delivered, name="deliver"),
]
