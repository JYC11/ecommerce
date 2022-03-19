from django.urls import path, include
from . import views

app_name = "product"

urlpatterns = [
    path("", views.get_products, name="get-products"),
    path("<str:pk>/", views.get_product, name="get-product"),
]
