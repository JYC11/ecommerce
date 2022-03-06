import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
} from "../cartActions";
import products from "../../mockData/products";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from "../../constants/cartConstants";

const middleware = [thunk];
const mockStore = configureMockStore(middleware);
const mock = new MockAdapter(axios);
const store = mockStore();

const address = {
  address: "Martinaise North 22, Whirling In Rags, Reception",
  city: "Revachol",
  postalCode: 123456,
  country: "Insulinde",
};

describe("test cart actions", () => {
  beforeEach(() => {
    store.clearActions();
  });

  it("dispatches cart add item action after successful API call", async () => {
    const store = mockStore({ cart: { cartItems: [] } });
    mock.onGet("/api/products/1/").reply(200, products[0]);
    await store.dispatch(addToCart(1, 1)).then(() => {
      let expectedAction = [
        {
          payload: {
            countInStock: products[0].countInStock,
            image: products[0].image,
            name: products[0].name,
            price: products[0].price,
            productId: products[0]._id,
            qty: 1,
          },
          type: CART_ADD_ITEM,
        },
      ];

      expect(store.getActions()).toEqual(expectedAction);
    });
  });

  it("dispatches cart remove item action", async () => {
    const store = mockStore({
      cart: {
        cartItems: [
          {
            countInStock: products[0].countInStock,
            image: products[0].image,
            name: products[0].name,
            price: products[0].price,
            productId: products[0]._id,
            qty: 1,
          },
        ],
      },
    });

    await store.dispatch(removeFromCart(1)).then(() => {
      let expectedAction = [{ payload: 1, type: CART_REMOVE_ITEM }];

      expect(store.getActions()).toEqual(expectedAction);
    });
  });

  it("dispatches save shipping address action", async () => {
    const store = mockStore({ cart: { cartItems: [] } });

    await store.dispatch(saveShippingAddress(address)).then(() => {
      let expectedAction = [
        { payload: address, type: CART_SAVE_SHIPPING_ADDRESS },
      ];

      expect(store.getActions()).toEqual(expectedAction);
    });
  });

  it("dispatches save payment method action", async () => {
    const store = mockStore({ cart: { cartItems: [] } });

    await store.dispatch(savePaymentMethod("PayPal")).then(() => {
      let expectedAction = [
        { payload: "PayPal", type: CART_SAVE_PAYMENT_METHOD },
      ];

      expect(store.getActions()).toEqual(expectedAction);
    });
  });
});
