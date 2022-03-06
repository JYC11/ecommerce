from django.shortcuts import render

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from core.models import Product, Order, OrderItem, ShippingAddress
from .serializers import OrderSerializer
from utils.helper_functions import order_total_checker


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data["orderItems"]

    total, shipping, tax = order_total_checker(orderItems)

    if (
        total != float(data["totalPrice"])
        or shipping != float(data["shippingPrice"])
        or tax != float(data["taxPrice"])
    ):
        return Response(
            {"detail": "Incorrect order price calculation"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if orderItems and len(orderItems) == 0:
        return Response(
            {"detail": "No Order Items"}, status=status.HTTP_400_BAD_REQUEST
        )
    else:
        # create order
        # recalculate tax, shipping, total price from frontend data
        order = Order.objects.create(
            user=user,
            paymentMethod=data["paymentMethod"],
            taxPrice=data["taxPrice"],
            shippingPrice=data["shippingPrice"],
            totalPrice=data["totalPrice"],
        )
        # create shipping address
        shipping = ShippingAddress.objects.create(
            order=order,
            address=data["shippingAddress"]["address"],
            city=data["shippingAddress"]["city"],
            postalCode=data["shippingAddress"]["postalCode"],
            country=data["shippingAddress"]["country"],
        )
        # create order items and set order to orderItem relationship
        for item in orderItems:
            product = Product.objects.get(_id=item["productId"])
            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=item["qty"],
                price=item["price"],
                image=product.image.url,
            )
            # update stock
            product.countInStock -= item.qty
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
