import { MemoryRouter, Route } from "react-router-dom";
import ProductScreen from "../ProductScreen";
import { listProductDetails } from "../../actions/productActions";
import { Provider } from "react-redux";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from "../../constants/productConstants";
import { mount, shallow } from "enzyme";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import Enzyme from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import products from "../../mockData/products";

const mockStore = configureMockStore([thunk]);

Enzyme.configure({ adapter: new Adapter() });

// I need to properly study how to do React tests because I am at my limit. I don't know what to do.

describe("testing product screen", () => {
  it("should render product screen with a product", () => {
    const store = mockStore({
      productDetails: { loading: false, error: null, product: products[0] },
    });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Route path="/product/1">
            <ProductScreen />
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });

  //   it("should render home screen with loading message", () => {
  //     const store = mockStore({
  //       productDetails: { loading: true, error: null, product: null },
  //     });
  //     const wrapper = mount(
  //       <Provider store={store}>
  //         <MemoryRouter>
  //           <Route path="/product/1">
  //             <ProductScreen />
  //           </Route>
  //         </MemoryRouter>
  //       </Provider>
  //     );
  //     expect(wrapper.text().includes("Loading")).toBe(true);
  //   });

  //   it("should render product screen with error message", () => {
  //     const store = mockStore({
  //       productDetails: { loading: false, error: "Error message", products: [] },
  //     });
  //     const wrapper = mount(
  //       <Provider store={store}>
  //         <MemoryRouter>
  //           <Route path="/product/1">
  //             <ProductScreen />
  //           </Route>
  //         </MemoryRouter>
  //       </Provider>
  //     );
  //     expect(wrapper.text().includes("Error message")).toBe(true);
  //     expect(wrapper.text().includes("Latest Products")).toBe(true);
  //   });
});
