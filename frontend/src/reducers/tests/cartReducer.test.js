import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../../constants/cartConstants";
import { cartReducer } from "../cartReducers";
import products from "../../products";

const product = {
  productId: products[0]._id,
  name: products[0].name,
  image: products[0].image,
  price: products[0].price,
  countInStock: products[0].countInStock,
  qty: 1,
};

test("should return empty cart state", () => {
  expect(cartReducer(undefined, {})).toEqual({
    cartItems: [],
  });
});

test("should return add new product to cart state", () => {
  expect(
    cartReducer(undefined, {
      type: CART_ADD_ITEM,
      payload: product,
    })
  ).toEqual({
    cartItems: [product],
  });
});

test("should return add existing product to cart state", () => {
  const previousState = {
    cartItems: [product],
  };

  expect(
    cartReducer(previousState, {
      type: CART_ADD_ITEM,
      payload: product,
    })
  ).toEqual({ cartItems: [{ ...product, qty: 2 }] });
});

test("should return empty cart state after removing only product", () => {
  const previousState = {
    cartItems: [product],
  };

  expect(
    cartReducer(previousState, {
      type: CART_REMOVE_ITEM,
      payload: "1",
    })
  ).toEqual({
    cartItems: [],
  });
});

test("should return cart state with only 1 product removed", () => {
  const product2 = {
    productId: products[1]._id,
    name: products[1].name,
    image: products[1].image,
    price: products[1].price,
    countInStock: products[1].countInStock,
    qty: 1,
  };
  const previousState = {
    cartItems: [product, product2],
  };

  expect(
    cartReducer(previousState, {
      type: CART_REMOVE_ITEM,
      payload: "1",
    })
  ).toEqual({
    cartItems: [product2],
  });
});
