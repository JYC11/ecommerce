import { render, screen } from "@testing-library/react";
import Message from "../Message";

it("should contain", () => {
  const error = "Nothing Found!";
  const messageVariant = "danger";
  render(<Message variant={messageVariant}>{error}</Message>);

  screen.getByText(error);
});
