import { MemoryRouter } from "react-router-dom";
import Header from "../Header";
import { Provider } from "react-redux";
import { mount } from "enzyme";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import Enzyme from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import userInfo from "../../mockData/user";

const mockStore = configureMockStore([thunk]);

Enzyme.configure({ adapter: new Adapter() });

describe("testing Header rendering with different states", () => {
  it("should contain texts 'ProShop', 'Cart', 'Login' when not logged in", () => {
    const store = mockStore({
      userLogin: {},
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.text().includes("ProShop")).toBe(true);
    expect(wrapper.text().includes("Cart")).toBe(true);
    expect(wrapper.text().includes("Login")).toBe(true);
  });

  it("should contain 'ProShop','Cart' and logged in user information when logged in", () => {
    const store = mockStore({
      userLogin: {
        userInfo: userInfo,
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.text().includes("ProShop")).toBe(true);
    expect(wrapper.text().includes("Cart")).toBe(true);
    expect(wrapper.text().includes(userInfo.name)).toBe(true);
    let usrnameBtn = wrapper.find("#username.dropdown-toggle.nav-link").at(0);
    usrnameBtn.simulate("click");
    expect(wrapper.text().includes("Profile")).toBe(true);
    expect(wrapper.text().includes("Logout")).toBe(true);
  });
});
