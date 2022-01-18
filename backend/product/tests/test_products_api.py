from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient
from core.models import Product
from product.serializers import ProductSerializer


class ProductAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user("test", "testpass123")

    def test_retrieve_product_list(self):
        Product.objects.create(
            user=self.user,
            name="test_product1",
            image="/placeholder.png",
            brand="acme",
            category="electronics",
            description="super cool",
            rating=4.5,
            numReviews=99,
            price=59.99,
            countInStock=10,
        )
        Product.objects.create(
            user=self.user,
            name="test_product2",
            image="/placeholder.png",
            brand="acme",
            category="electronics",
            description="super cool",
            rating=4.8,
            numReviews=100,
            price=79.99,
            countInStock=12,
        )
        res = self.client.get("/api/products/")
        products = Product.objects.all().order_by("_id")
        serializer = ProductSerializer(products, many=True)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_one_product(self):
        Product.objects.create(
            user=self.user,
            name="test_product1",
            image="/placeholder.png",
            brand="acme",
            category="electronics",
            description="super cool",
            rating=4.5,
            numReviews=99,
            price=59.99,
            countInStock=10,
        )
        res = self.client.get("/api/products/1/")
        product = Product.objects.get(_id=1)
        serializer = ProductSerializer(product, many=False)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data, serializer.data)
