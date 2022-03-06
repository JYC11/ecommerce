import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createOrder } from "../orderActions";
import userInfo from "../../mockData/user";
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_SUCCESS,
} from "../../constants/orderConstants";
import { CART_CLEAR_ITEMS } from "../../constants/cartConstants";

const middleware = [thunk];
const mockStore = configureMockStore(middleware);
const mock = new MockAdapter(axios);
const store = mockStore();

describe("test order actions", () => {
  beforeEach(() => {
    store.clearActions();
  });

  it("should create order successfully", async () => {
    const store = mockStore({ userLogin: { userInfo: userInfo } });
    mock.onPost("/api/orders/add/").reply(200, "success-order-data");

    await store.dispatch(createOrder("order-data")).then(() => {
      let expectedActions = [
        {
          type: ORDER_CREATE_REQUEST,
        },
        {
          type: ORDER_CREATE_SUCCESS,
          payload: "success-order-data",
        },
        {
          type: CART_CLEAR_ITEMS,
          payload: "success-order-data",
        },
      ];

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("should fail to create order", async () => {
    const store = mockStore({ userLogin: { userInfo: userInfo } });
    mock.onPost("/api/orders/add/").reply(400, "error");

    await store.dispatch(createOrder("order-data")).then(() => {
      let expectedActions = [
        {
          type: ORDER_CREATE_REQUEST,
        },
        {
          type: ORDER_CREATE_FAIL,
          payload: "Request failed with status code 400",
        },
      ];

      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
