import { productDetailsReducer, productListReducer } from "../productReducers";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from "../../constants/productConstants";
import products from "../../mockData/products";

describe("product reducer test", () => {
  it("should return initial product list state", () => {
    expect(
      productListReducer(undefined, { type: PRODUCT_LIST_REQUEST })
    ).toEqual({ loading: true, products: [] });
  });

  it("should return product list success state", () => {
    expect(
      productListReducer(undefined, {
        type: PRODUCT_LIST_SUCCESS,
        payload: products,
      })
    ).toEqual({
      loading: false,
      products: products,
    });
  });

  it("should return product list fail state", () => {
    expect(
      productListReducer(undefined, {
        type: PRODUCT_LIST_FAIL,
        payload: "No products found",
      })
    ).toEqual({ error: "No products found", loading: false });
  });

  it("should get initial product details state", () => {
    expect(
      productDetailsReducer(undefined, { type: PRODUCT_DETAILS_REQUEST })
    ).toEqual({
      loading: true,
      product: {
        reviews: [],
      },
    });
  });

  it("should get product details success state", () => {
    expect(
      productDetailsReducer(undefined, {
        type: PRODUCT_DETAILS_SUCCESS,
        payload: products[0],
      })
    ).toEqual({
      loading: false,
      product: products[0],
    });
  });

  it("should get product details fail state", () => {
    expect(
      productDetailsReducer(undefined, {
        type: PRODUCT_DETAILS_FAIL,
        payload: "No details found",
      })
    ).toEqual({
      loading: false,
      error: "No details found",
    });
  });
});
