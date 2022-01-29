import { render, screen } from "@testing-library/react";
import Loader from "../Loader";

it("should contain 'Loading'", () => {
  render(<Loader />);

  screen.getByText("Loading");
});
