import { MemoryRouter } from "react-router-dom";
import HomeScreen from "../HomeScreen";
import { Provider } from "react-redux";
import { mount } from "enzyme";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import Enzyme from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import products from "../../mockData/products";

const mockStore = configureMockStore([thunk]);

Enzyme.configure({ adapter: new Adapter() });

describe("testing home screen", () => {
  it("should render home screen with products", () => {
    const store = mockStore({
      productList: { loading: false, error: null, products: products },
    });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <HomeScreen />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.text().includes("Latest Products")).toBe(true);

    for (let i = 0; i < products.length; i++) {
      expect(wrapper.text().includes(products[i].name)).toBe(true);
      expect(wrapper.text().includes(`${products[i].numReviews} reviews`)).toBe(
        true
      );
      expect(wrapper.text().includes(`$${products[i].price}`)).toBe(true);
    }
  });

  it("should render home screen with loading message", () => {
    const store = mockStore({
      productList: { loading: true, error: null, products: [] },
    });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <HomeScreen />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.text().includes("Loading")).toBe(true);
    expect(wrapper.text().includes("Latest Products")).toBe(true);
  });

  it("should render home screen with error message", () => {
    const store = mockStore({
      productList: { loading: false, error: "Error message", products: [] },
    });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <HomeScreen />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.text().includes("Error message")).toBe(true);
    expect(wrapper.text().includes("Latest Products")).toBe(true);
  });
});
