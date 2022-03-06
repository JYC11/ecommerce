from core.models import Product
from utils.constants import TAX_RATE, FREE_SHIPPING_LIMIT, BASE_SHIPPING_FEE


def order_total_checker(orderItems):
    subtotal = 0

    for item in orderItems:
        product = Product.objects.get(_id=item["productId"])
        qty = item["qty"]
        price = product.price
        subtotal += float(qty) * float(price)

    subtotal = round(float(subtotal), 2)
    tax = round(float(subtotal) * TAX_RATE)
    shipping = 0 if subtotal > FREE_SHIPPING_LIMIT else BASE_SHIPPING_FEE
    total = subtotal + tax + shipping
    return [total, shipping, tax]
