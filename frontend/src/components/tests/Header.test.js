import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";

describe("testing Header rendering with different states", () => {
  it("should contain texts 'ProShop', 'Cart', 'Login'", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    screen.getByText("ProShop");
    screen.getByText("Cart");
    screen.getByText("Login");
  });
});
