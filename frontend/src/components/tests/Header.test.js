import { MemoryRouter } from "react-router-dom";
import Header from "../Header";
import { Provider } from "react-redux";
import { mount } from "enzyme";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import Enzyme from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

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
        userInfo: {
          refresh:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY0NDg0NjAzMSwiaWF0IjoxNjQ0NzU5NjMxLCJqdGkiOiIwMzk2NTIxM2Y3Zjk0NTM0OTU1OWRkOTIwMDliM2VjMyIsInVzZXJfaWQiOjJ9.RtpUNsW8QBs73W8Gbhgl0y8WG-abmCyG-gFt4uQFO10",
          access:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQ3MzUxNjMxLCJpYXQiOjE2NDQ3NTk2MzEsImp0aSI6IjFkN2NiMzNhNDQ1OTRlZGU5NjAyNjUwOWVjMjY2NGE1IiwidXNlcl9pZCI6Mn0.tvHNSiFu3M5_h4e2OJ1wOVfgZGeF7tcTpcmIqdYcL_g",
          _id: 2,
          username: "john@email.com",
          email: "john@email.com",
          name: "john doe joestar kujo",
          isAdmin: false,
          token:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQ3MzUxNjMxLCJpYXQiOjE2NDQ3NTk2MzEsImp0aSI6IjIzMjI2ODY2NTdmNzQ2ZGViMDc0MGM2YzAwMTMyMzVjIiwidXNlcl9pZCI6Mn0.dGjGUeYNxtPgV8h-lcT8vCJ4tafQZqjRS8zHb871NPA",
        },
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
    expect(wrapper.text().includes("john doe joestar kujo")).toBe(true);
    let usrnameBtn = wrapper.find("#username.dropdown-toggle.nav-link").at(0);
    usrnameBtn.simulate("click");
    expect(wrapper.text().includes("Profile")).toBe(true);
    expect(wrapper.text().includes("Logout")).toBe(true);
  });
});
