import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_RESET,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  MY_ORDERS_LIST_REQUEST,
  MY_ORDERS_LIST_SUCCESS,
  MY_ORDERS_LIST_FAIL,
  MY_ORDERS_LIST_RESET,
} from "../../constants/orderConstants";
import {
  orderCreateReducer,
  orderDetailsReducer,
  myOrdersListReducer,
} from "../orderReducers";

describe("order reducer test", () => {
  it("should return loading state", () => {
    expect(
      orderCreateReducer(undefined, { type: ORDER_CREATE_REQUEST })
    ).toEqual({
      loading: true,
    });
  });

  it("should return order created successfully state", () => {
    expect(
      orderCreateReducer(undefined, {
        type: ORDER_CREATE_SUCCESS,
        payload: "order data",
      })
    ).toEqual({
      loading: false,
      success: true,
      order: "order data",
    });
  });

  it("should return order created failed state", () => {
    expect(
      orderCreateReducer(undefined, {
        type: ORDER_CREATE_FAIL,
        payload: "error message",
      })
    ).toEqual({
      loading: false,
      error: "error message",
    });
  });

  it("should return resetted order state", () => {
    expect(
      orderCreateReducer(undefined, {
        type: ORDER_CREATE_RESET,
      })
    ).toEqual({});
  });
});

describe("order details reducer test", () => {
  it("should return loading state", () => {
    expect(
      orderDetailsReducer(undefined, { type: ORDER_DETAILS_REQUEST })
    ).toEqual({
      loading: true,
      orderItems: [],
      shippingAddress: {},
    });
  });

  it("should return order details retrieved successfully state", () => {
    expect(
      orderDetailsReducer(undefined, {
        type: ORDER_DETAILS_SUCCESS,
        payload: "order details data",
      })
    ).toEqual({
      loading: false,
      order: "order details data",
    });
  });

  it("should return order details retrieval failed state", () => {
    expect(
      orderDetailsReducer(undefined, {
        type: ORDER_DETAILS_FAIL,
        payload: "error message",
      })
    ).toEqual({
      loading: false,
      error: "error message",
    });
  });
});

describe("order list reducer test", () => {
  it("should return loading state", () => {
    expect(
      myOrdersListReducer(undefined, { type: MY_ORDERS_LIST_REQUEST })
    ).toEqual({
      loading: true,
    });
  });

  it("should return order list retrieved successfully state", () => {
    expect(
      myOrdersListReducer(undefined, {
        type: MY_ORDERS_LIST_SUCCESS,
        payload: "order details data",
      })
    ).toEqual({
      loading: false,
      orders: "order details data",
    });
  });

  it("should return order list retrieval failed state", () => {
    expect(
      myOrdersListReducer(undefined, {
        type: MY_ORDERS_LIST_FAIL,
        payload: "error message",
      })
    ).toEqual({
      loading: false,
      error: "error message",
    });
  });

  it("should return reset order list state", () => {
    expect(
      myOrdersListReducer(undefined, {
        type: MY_ORDERS_LIST_RESET,
      })
    ).toEqual({
      orders: [],
    });
  });
});
