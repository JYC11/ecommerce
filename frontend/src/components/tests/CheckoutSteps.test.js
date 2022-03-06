import { render, screen } from "@testing-library/react";
import CheckoutSteps from "../CheckoutSteps";

it("should contain text Copyright © Proshop", () => {
  render(<CheckoutSteps />);

  screen.getAllByText("Login");
  screen.getAllByText("Shipping");
  screen.getAllByText("Payment");
  screen.getAllByText("Place Order");
});
