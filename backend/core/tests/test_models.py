from django.test import TestCase
from django.contrib.auth import get_user_model
from core import models
from unittest import mock
from django.utils import timezone


class ModelTests(TestCase):
    time_test_now = timezone.now()

    @mock.patch("django.utils.timezone.now")
    def setUp(self, mock_now):
        mock_now.return_value = self.time_test_now
        self.user = get_user_model().objects.create_user("test", "testpass123")
        self.product = models.Product.objects.create(
            user=self.user,
            name="test_product",
            image="/placeholder.png",
            brand="acme",
            category="electronics",
            description="super cool",
            rating=4.5,
            numReviews=99,
            price=59.99,
            countInStock=10,
        )
        self.order = models.Order.objects.create(
            user=self.user,
            paymentMethod="card",
            taxPrice=20,
            shippingPrice=30,
            totalPrice=150,
            isPaid=True,
            paidAt=self.time_test_now,
            isDelivered=True,
            deliveredAt=self.time_test_now,
        )

    def test_product_str(self):
        """tests product string representation"""
        product = self.product
        self.assertEqual(str(product), "test_product")

    def test_review_str(self):
        """test review string representation"""
        review = models.Review.objects.create(
            product=self.product,
            user=self.user,
            name="amazing product",
            rating=5,
            comment="super awesome will buy again",
        )
        self.assertEqual(str(review), "5")

    def test_order_str(self):
        """test order string representation"""
        order = self.order
        self.assertEqual(str(order), str(self.time_test_now))

    def test_order_item_str(self):
        """test order item string representation"""
        order_item = models.OrderItem.objects.create(
            product=self.product,
            order=self.order,
            name="fast order",
            qty=10,
            price=1000,
            image="/placeholder.png",
        )
        self.assertEqual(str(order_item), "fast order")

    def test_shipping_address_str(self):
        """test shipping address string representation"""
        shipping_address = models.ShippingAddress.objects.create(
            order=self.order,
            address="29 Martinaise Street",
            city="Revachol",
            postalCode=11111,
            country="Elysium",
            shippingPrice=20,
        )
        self.assertEqual(str(shipping_address), "29 Martinaise Street")
