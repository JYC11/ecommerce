import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { addToCart, removeFromCart } from "../cartActions";
import products from "../../mockData/products";
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../../constants/cartConstants";

const middleware = [thunk];
const mockStore = configureMockStore(middleware);
const mock = new MockAdapter(axios);
const store = mockStore();

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
});
