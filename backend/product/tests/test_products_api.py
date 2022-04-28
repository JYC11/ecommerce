from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient
from core.models import Product
from product.serializers import ProductSerializer
from django.urls import reverse
from user.tests.test_user_api import create_user, create_superuser

GET_ALL_PRODUCTS_URL = reverse("product:get-products")
PRODUCT_ONE_URL = reverse("product:get-product", args=[1])
CREATE_PRODUCT_URL = reverse("product:create-product")
UPDATE_PRODUCT_URL = reverse("product:update-product")
DELETE_PRODUCT_URL = reverse("product:delete-product")
UPLOAD_IMAGE_URL = reverse("product:image-upload")
CREATE_PRODUCT_REVIEW_URL = reverse("product:create-review")
GET_TOP_PRODUCT_URL = reverse("product:top-products")


class PublicProductAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user("test", "testpass123")

    def test_retrieve_product_list_endpoint(self):
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
        res = self.client.get(GET_ALL_PRODUCTS_URL)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["page"], 1)
        self.assertEqual(res.data["pages"], 1)
        products = sorted(res.data["products"], key=lambda x: x["_id"])

        self.assertEqual(products[0]["_id"], 1)
        self.assertEqual(products[0]["reviews"], [])
        self.assertEqual(products[0]["name"], "test_product1")
        self.assertEqual(products[0]["image"], "/placeholder.png")
        self.assertEqual(products[0]["brand"], "acme")
        self.assertEqual(products[0]["category"], "electronics")
        self.assertEqual(products[0]["description"], "super cool")
        self.assertEqual(products[0]["rating"], "4.50")
        self.assertEqual(products[0]["numReviews"], 99)
        self.assertEqual(products[0]["price"], "59.99")
        self.assertEqual(products[0]["countInStock"], 10)
        self.assertEqual(products[0]["user"], 1)

        self.assertEqual(products[1]["_id"], 2)
        self.assertEqual(products[1]["reviews"], [])
        self.assertEqual(products[1]["name"], "test_product2")
        self.assertEqual(products[1]["image"], "/placeholder.png")
        self.assertEqual(products[1]["brand"], "acme")
        self.assertEqual(products[1]["category"], "electronics")
        self.assertEqual(products[1]["description"], "super cool")
        self.assertEqual(products[1]["rating"], "4.80")
        self.assertEqual(products[1]["numReviews"], 100)
        self.assertEqual(products[1]["price"], "79.99")
        self.assertEqual(products[1]["countInStock"], 12)
        self.assertEqual(products[1]["user"], 1)

    def test_retrieve_one_product_endpoint(self):
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
        res = self.client.get(PRODUCT_ONE_URL)
        product = Product.objects.get(_id=1)
        serializer = ProductSerializer(product, many=False)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data, serializer.data)

    def test_create_product(self):
        """no-auth create product"""
        pass

    def test_update_product(self):
        """no-auth create product"""
        pass

    def test_delete_product(self):
        """no-auth create product"""
        pass

    def test_create_product_review(self):
        """no-auth create review"""
        pass

    def test_get_top_products(self):
        """no-auth get top products"""
        pass


class PrivateProductApiTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.payload1 = {
            "name": "Jim Bob",
            "email": "jim@example.com",
            "password": "coolPassword123",
        }
        self.user = create_user(self.payload1)
        self.client.force_authenticate(user=self.user)

    def test_create_product(self):
        """non-admin create product"""
        pass

    def test_update_product(self):
        """non-admin create product"""
        pass

    def test_delete_product(self):
        """non-admin create product"""
        pass

    def test_create_product_review(self):
        """non-admin create product review"""
        pass

    def test_get_top_products(self):
        """non-admin get top products"""
        pass


class PrivateAdminProductApiTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.payload_admin = {
            "name": "admin",
            "email": "admin@example.com",
            "password": "coolPassword123",
        }
        self.payload1 = {
            "name": "Jim Bob",
            "email": "jim@example.com",
            "password": "coolPassword123",
        }
        self.payload2 = {
            "name": "Mary",
            "email": "mary@example.com",
            "password": "coolPassword123",
        }
        self.admin = create_superuser(self.payload_admin)
        self.client.force_authenticate(user=self.admin)

    def test_create_product(self):
        """admin create product"""
        pass

    def test_update_product(self):
        """admin create product"""
        pass

    def test_delete_product(self):
        """admin create product"""
        pass
