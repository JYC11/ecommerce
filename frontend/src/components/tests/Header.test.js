import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header";
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
