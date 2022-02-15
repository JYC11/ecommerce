import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { listProducts, listProductDetails } from "../productActions";
import products from "../../mockData/products";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from "../../constants/productConstants";

const middleware = [thunk];
const mockStore = configureMockStore(middleware);
const mock = new MockAdapter(axios);
const store = mockStore();

describe("test product actions", () => {
  beforeEach(() => {
    store.clearActions();
  });

  it("dispatches product success action after successful API call", async () => {
    mock.onGet("/api/products/").reply(200, products);
    await store.dispatch(listProducts()).then(() => {
      let expectedAction = [
        { type: PRODUCT_LIST_REQUEST },
        { payload: products, type: PRODUCT_LIST_SUCCESS },
      ];

      expect(store.getActions()).toEqual(expectedAction);
    });
  });

  it("dispatches product fail action after fail API call", async () => {
    mock.onGet("/api/products/").reply(404, "Error");
    await store.dispatch(listProducts()).then(() => {
      let expectedAction = [
        { type: PRODUCT_LIST_REQUEST },
        {
          payload: "Request failed with status code 404",
          type: PRODUCT_LIST_FAIL,
        },
      ];

      expect(store.getActions()).toEqual(expectedAction);
    });
  });

  it("dispatches product details success action after successful API call", async () => {
    mock.onGet("/api/products/1/").reply(200, products[0]);
    await store.dispatch(listProductDetails(1)).then(() => {
      let expectedAction = [
        { type: PRODUCT_DETAILS_REQUEST },
        { payload: products[0], type: PRODUCT_DETAILS_SUCCESS },
      ];

      expect(store.getActions()).toEqual(expectedAction);
    });
  });

  it("dispatches product details fail action after failed API call", async () => {
    mock.onGet("/api/products/99999999999999/").reply(404, "Error Message");
    await store.dispatch(listProductDetails(999)).then(() => {
      let expectedAction = [
        { type: PRODUCT_DETAILS_REQUEST },
        {
          payload: "Request failed with status code 404",
          type: PRODUCT_DETAILS_FAIL,
        },
      ];

      expect(store.getActions()).toEqual(expectedAction);
    });
  });
});
