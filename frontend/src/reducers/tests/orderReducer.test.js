import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_RESET,
} from "../../constants/orderConstants";
import { orderCreateReducer } from "../orderReducers";

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
