import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_CLEAR_ITEMS,
} from "../../constants/cartConstants";
import { cartReducer } from "../cartReducers";
import products from "../../mockData/products";

describe("cart reducer test", () => {
  const product = {
    productId: products[0]._id,
    name: products[0].name,
    image: products[0].image,
    price: products[0].price,
    countInStock: products[0].countInStock,
    qty: 1,
  };

  const product2 = {
    productId: products[1]._id,
    name: products[1].name,
    image: products[1].image,
    price: products[1].price,
    countInStock: products[1].countInStock,
    qty: 1,
  };

  const address = {
    address: "Martinaise North 22, Whirling In Rags, Reception",
    city: "Revachol",
    postalCode: 123456,
    country: "Insulinde",
  };

  const paymentMethod = "PayPal";

  it("should return empty cart state", () => {
    expect(cartReducer(undefined, {})).toEqual({
      cartItems: [],
      shippingAddress: {},
    });
  });

  it("should return add new product to cart state", () => {
    expect(
      cartReducer(undefined, {
        type: CART_ADD_ITEM,
        payload: product,
      })
    ).toEqual({
      cartItems: [product],
      shippingAddress: {},
    });
  });

  it("should return add existing product to cart state", () => {
    const previousState = {
      cartItems: [product],
      shippingAddress: {},
    };

    expect(
      cartReducer(previousState, {
        type: CART_ADD_ITEM,
        payload: product,
      })
    ).toEqual({
      cartItems: [{ ...product, qty: 2 }],
      shippingAddress: {},
    });
  });

  it("should return empty cart state after removing only product", () => {
    const previousState = {
      cartItems: [product],
      shippingAddress: {},
    };

    expect(
      cartReducer(previousState, {
        type: CART_REMOVE_ITEM,
        payload: "1",
      })
    ).toEqual({
      cartItems: [],
      shippingAddress: {},
    });
  });

  it("should return cart state with only 1 product removed", () => {
    const previousState = {
      cartItems: [product, product2],
      shippingAddress: {},
    };

    expect(
      cartReducer(previousState, {
        type: CART_REMOVE_ITEM,
        payload: "1",
      })
    ).toEqual({
      cartItems: [product2],
      shippingAddress: {},
    });
  });

  it("should return cart state with shipping address", () => {
    const previousState = {
      cartItems: [product, product2],
      shippingAddress: {},
    };

    expect(
      cartReducer(previousState, {
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: address,
      })
    ).toEqual({
      cartItems: [product, product2],
      shippingAddress: address,
    });
  });

  it("should return cart state with payment", () => {
    const previousState = {
      cartItems: [product, product2],
      shippingAddress: {},
    };

    expect(
      cartReducer(previousState, {
        type: CART_SAVE_PAYMENT_METHOD,
        payload: paymentMethod,
      })
    ).toEqual({
      cartItems: [product, product2],
      shippingAddress: {},
      paymentMethod: paymentMethod,
    });
  });

  it("should clear contents in cart", () => {
    const previousState = {
      cartItems: [product, product2],
    };

    expect(
      cartReducer(previousState, {
        type: CART_CLEAR_ITEMS,
      })
    ).toEqual({
      cartItems: [],
    });
  });
});
