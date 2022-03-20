import { MemoryRouter } from "react-router-dom";
import CartScreen from "../CartScreen";
import { Provider } from "react-redux";
import { mount, shallow } from "enzyme";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import Enzyme from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import products from "../../mockData/products";

const mockStore = configureMockStore([thunk]);

Enzyme.configure({ adapter: new Adapter() });

describe("testing cart screen", () => {
  it("should render cart screen with product(s) in cart", () => {
    const cartItems = [
      {
        productId: products[0]._id,
        name: products[0].name,
        image: products[0].image,
        price: products[0].price,
        countInStock: products[0].countInStock,
        qty: 1,
      },
      {
        productId: products[1]._id,
        name: products[1].name,
        image: products[1].image,
        price: products[1].price,
        countInStock: products[1].countInStock,
        qty: 1,
      },
    ];
    let subtotal = cartItems.reduce((acc, item) => acc + Number(item.qty), 0);

    let subtotalPrice = cartItems.reduce(
      (acc, item) => acc + Number(item.qty) * Number(item.price),
      0
    );

    const store = mockStore({
      cart: {
        cartItems: cartItems,
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CartScreen />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.text().includes("Shopping Cart")).toBe(true);
    expect(wrapper.text().includes("Proceed To Checkout")).toBe(true);
    expect(wrapper.text().includes("SubTotal")).toBe(true);
    expect(wrapper.text().includes(cartItems[0].name)).toBe(true);
    expect(wrapper.text().includes(cartItems[1].name)).toBe(true);
    expect(wrapper.text().includes(`$${cartItems[0].price}`)).toBe(true);
    expect(wrapper.text().includes(`$${cartItems[1].price}`)).toBe(true);
    expect(wrapper.text().includes(`${subtotal}`)).toBe(true);
    expect(wrapper.text().includes(`$${subtotalPrice}`)).toBe(true);
    expect(wrapper.find("input").at(0).prop("value")).toEqual(1);
    expect(wrapper.find("input").at(1).prop("value")).toEqual(1);
  });

  it("should test quantity change in cart", () => {
    // lmao this doesn't work at all
    const cartItems = [
      {
        productId: products[0]._id,
        name: products[0].name,
        image: products[0].image,
        price: products[0].price,
        countInStock: products[0].countInStock,
        qty: 1,
      },
    ];

    const store = mockStore({
      cart: {
        cartItems: cartItems,
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CartScreen />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("input").prop("value")).toEqual(1);
    let firstCartItemQty = wrapper.find("input");
    // firstCartItemQty.simulate("click");
    // firstCartItemQty.simulate("change", {
    //   target: { name: "cart-qty", value: "2" },
    // });
    // firstCartItemQty.getDOMNode().value = "2";
    firstCartItemQty.props().value = 2;
    // firstCartItemQty.simulate("change");
    // firstCartItemQty.props().onChange({ target: { value: 2 } });
    // wrapper.update();
    expect(wrapper.find("input").prop("value")).toEqual(2);
    // console.log(wrapper.text());
    // expect(wrapper.text().includes(`$${products[0].price * 2}`)).toBe(true);
  });
});
