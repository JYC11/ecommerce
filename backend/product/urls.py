from django.urls import path, include
from . import views

app_name = "product"

urlpatterns = [
    path("", views.get_products, name="get-products"),
    path("create/", views.create_product, name="create-product"),
    path("upload/", views.upload_image, name="image-upload"),
    path("<str:pk>/reviews/", views.create_product_review, name="create-review"),
    path("top/", views.get_top_products, name="top-products"),
    path("<str:pk>/", views.get_product, name="get-product"),
    path("update/<str:pk>/", views.update_product, name="update-product"),
    path("delete/<str:pk>/", views.delete_product, name="delete-product"),
]
