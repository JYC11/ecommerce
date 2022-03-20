import { render, screen } from "@testing-library/react";
import Footer from "../Footer";
it("should contain text Copyright © Proshop", () => {
  render(<Footer />);

  screen.getAllByText("Copyright © ProShop");
});
