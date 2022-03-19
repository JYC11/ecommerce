from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from core.models import Order, OrderItem, ShippingAddress, Product
from order.serializers import (
    OrderSerializer,
    OrderItemSerializer,
    ShippingAddressSerializer,
)
from product.serializers import ProductSerializer
from product.mock_data import products
from user.tests.test_user_api import create_user
from utils.helper_functions import order_total_checker
from utils.constants import TAX_RATE, FREE_SHIPPING_LIMIT, BASE_SHIPPING_FEE


CREATE_ORDER_URL = reverse("order:orders-add")
ORDER_ONE_URL = reverse("order:user-order", args=[1])
UPDATE_ORDER_ONE_TO_PAID_URL = reverse("order:pay", args=[1])
UPDATE_ORDER_ONE_TO_DELIVERED_URL = reverse("order:deliver", args=[1])
GET_MY_ORDERS_URL = reverse("order:my-orders")

order_items = [
    {
        "productId": products[0]["_id"],
        "name": products[0]["name"],
        "image": products[0]["image"],
        "price": products[0]["price"],
        "countInStock": products[0]["countInStock"],
        "qty": 1,
    },
    {
        "productId": products[1]["_id"],
        "name": products[1]["name"],
        "image": products[1]["image"],
        "price": products[1]["price"],
        "countInStock": products[1]["countInStock"],
        "qty": 2,
    },
]

items_price = round(
    order_items[0]["price"] * order_items[0]["qty"]
    + order_items[1]["price"] * order_items[1]["qty"],
    2,
)
shipping_price = round(0 if items_price > FREE_SHIPPING_LIMIT else BASE_SHIPPING_FEE, 2)
tax_price = round(items_price * TAX_RATE, 2)

mock_order_data = {
    "orderItems": order_items,
    "shippingAddress": {
        "address": "Martinaise North 22, Whirling In Rags, Reception",
        "city": "Revachol",
        "postalCode": 123456,
        "country": "Insulinde",
    },
    "paymentMethod": "Paypal",
    "itemsPrice": items_price,
    "shippingPrice": shipping_price,
    "taxPrice": tax_price,
    "totalPrice": items_price + tax_price + shipping_price,
}


class HelperFunctionTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.payload1 = {
            "name": "Jim Bob",
            "email": "jim@example.com",
            "password": "coolPassword123",
        }
        self.user = create_user(self.payload1)

    def test_order_total_checker(self):
        """test order total checker"""
        for product in products:
            Product.objects.create(
                user=self.user,
                name=product["name"],
                image=product["image"],
                brand=product["brand"],
                category=product["category"],
                description=product["description"],
                rating=product["rating"],
                numReviews=product["numReviews"],
                price=product["price"],
                countInStock=product["countInStock"],
            )
        total, shipping, tax = order_total_checker(order_items)
        self.assertEqual(total, mock_order_data["totalPrice"])
        self.assertEqual(shipping, mock_order_data["shippingPrice"])
        self.assertEqual(tax, mock_order_data["taxPrice"])


class PublicOrderAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.payload1 = {
            "name": "Jim Bob",
            "email": "jim@example.com",
            "password": "coolPassword123",
        }
        self.user = create_user(self.payload1)

    def test_create_order_no_auth(self):
        """test order api post request without user authorisation"""
        res = self.client.post(CREATE_ORDER_URL, mock_order_data, format="json")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(
            res.data["detail"], "Authentication credentials were not provided."
        )

    def test_get_order_no_auth(self):
        """test single order api get request without user authorisation"""
        res = self.client.get(ORDER_ONE_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(
            res.data["detail"], "Authentication credentials were not provided."
        )

    def test_get_my_orders_no_auth(self):
        """test order list api get request without user authorisation"""
        res = self.client.get(GET_MY_ORDERS_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(
            res.data["detail"], "Authentication credentials were not provided."
        )


class PrivateOrderAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.payload1 = {
            "name": "Jim Bob",
            "email": "jim@example.com",
            "password": "coolPassword123",
        }
        self.user = create_user(self.payload1)
        self.client.force_authenticate(user=self.user)

    def create_products(self):
        """creates dummy products"""
        for product in products:
            Product.objects.create(
                user=self.user,
                name=product["name"],
                image=product["image"],
                brand=product["brand"],
                category=product["category"],
                description=product["description"],
                rating=product["rating"],
                numReviews=product["numReviews"],
                price=product["price"],
                countInStock=product["countInStock"],
            )

    def default_order_data_checker(self, order_data):
        """does default checking of order data"""
        _order_items = OrderItem.objects.all().order_by("_id")
        order_item_serializer_data = (OrderItemSerializer(_order_items, many=True)).data

        _shipping_address = ShippingAddress.objects.get(_id=1)
        shipping_address_serializer_data = (
            ShippingAddressSerializer(_shipping_address, many=False)
        ).data

        _products = Product.objects.all().order_by("_id")
        product_serializer_data = (ProductSerializer(_products, many=True)).data

        self.assertEqual(order_data["user"]["username"], self.payload1["email"])
        self.assertEqual(order_data["user"]["email"], self.payload1["email"])
        self.assertEqual(order_data["user"]["name"], self.payload1["name"])
        self.assertEqual(order_data["paymentMethod"], mock_order_data["paymentMethod"])
        self.assertEqual(float(order_data["taxPrice"]), mock_order_data["taxPrice"])
        self.assertEqual(
            float(order_data["shippingPrice"]),
            mock_order_data["shippingPrice"],
        )
        self.assertEqual(float(order_data["totalPrice"]), mock_order_data["totalPrice"])
        self.assertEqual(order_data["isPaid"], False)
        self.assertEqual(order_data["paidAt"], None)
        self.assertEqual(order_data["isDelivered"], False)
        self.assertEqual(order_data["deliveredAt"], None)
        self.assertEqual(order_data["orderItems"], order_item_serializer_data)

        self.assertEqual(
            shipping_address_serializer_data["address"],
            mock_order_data["shippingAddress"]["address"],
        )
        self.assertEqual(
            shipping_address_serializer_data["city"],
            mock_order_data["shippingAddress"]["city"],
        )
        self.assertEqual(
            int(shipping_address_serializer_data["postalCode"]),
            mock_order_data["shippingAddress"]["postalCode"],
        )
        self.assertEqual(
            shipping_address_serializer_data["country"],
            mock_order_data["shippingAddress"]["country"],
        )
        self.assertEqual(shipping_address_serializer_data["order"], order_data["_id"])

        for i in range(2):
            self.assertEqual(
                order_item_serializer_data[i]["product"], order_items[i]["productId"]
            )
            self.assertEqual(
                order_item_serializer_data[i]["name"], order_items[i]["name"]
            )
            self.assertEqual(
                float(order_item_serializer_data[i]["price"]), order_items[i]["price"]
            )
            self.assertEqual(
                order_item_serializer_data[i]["image"], order_items[i]["image"]
            )
            self.assertEqual(
                order_item_serializer_data[i]["qty"], order_items[i]["qty"]
            )
            self.assertEqual(order_item_serializer_data[i]["order"], order_data["_id"])
            self.assertEqual(
                product_serializer_data[i]["countInStock"],
                products[i]["countInStock"] - order_items[i]["qty"],
            )

    def test_create_order_endpoint(self):
        """test order api post request with user authorisation"""
        self.create_products()
        res = self.client.post(CREATE_ORDER_URL, mock_order_data, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        _order = Order.objects.get(_id=1)
        order_serializer_data = (OrderSerializer(_order, many=False)).data

        self.default_order_data_checker(order_serializer_data)

    def test_get_order_endpoint(self):
        """test order api get request with user authorisation"""
        self.create_products()
        self.client.post(CREATE_ORDER_URL, mock_order_data, format="json")
        res = self.client.get(ORDER_ONE_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.default_order_data_checker(res.data)

    def test_pay_order_endpoint(self):
        """test order api request to pay order"""
        self.create_products()
        self.client.post(CREATE_ORDER_URL, mock_order_data, format="json")
        res = self.client.patch(UPDATE_ORDER_ONE_TO_PAID_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, "Order was paid")

        _order = Order.objects.get(_id=1)
        order_serializer_data = (OrderSerializer(_order, many=False)).data

        self.assertEqual(order_serializer_data["isPaid"], True)

    def test_deliver_order_endpoint(self):
        """test order api request to indicate order is delivered"""
        for product in products:
            Product.objects.create(
                user=self.user,
                name=product["name"],
                image=product["image"],
                brand=product["brand"],
                category=product["category"],
                description=product["description"],
                rating=product["rating"],
                numReviews=product["numReviews"],
                price=product["price"],
                countInStock=product["countInStock"],
            )
        self.client.post(CREATE_ORDER_URL, mock_order_data, format="json")
        res = self.client.patch(UPDATE_ORDER_ONE_TO_DELIVERED_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, "Order was delivered")

        _order = Order.objects.get(_id=1)
        order_serializer_data = (OrderSerializer(_order, many=False)).data

        self.assertEqual(order_serializer_data["isDelivered"], True)

    def test_get_my_orders(self):
        """test get user's list of orders"""
        self.create_products()
        self.client.post(CREATE_ORDER_URL, mock_order_data, format="json")
        self.client.post(CREATE_ORDER_URL, mock_order_data, format="json")

        res = self.client.get(GET_MY_ORDERS_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 2)

        _order1 = Order.objects.get(_id=1)
        order_serializer_data1 = (OrderSerializer(_order1, many=False)).data

        _order2 = Order.objects.get(_id=2)
        order_serializer_data2 = (OrderSerializer(_order2, many=False)).data

        self.assertEqual(res.data[0], order_serializer_data1)
        self.assertEqual(res.data[1], order_serializer_data2)
