import { render, screen } from "@testing-library/react";
import Rating from "../Rating";

it("should render rating stars", () => {
  const productRating = 4.5;
  const productReviewCount = 15;
  const color = "#f8e825";
  render(
    <Rating
      value={productRating}
      text={`${productReviewCount} reviews`}
      color={color}
    />
  );

  screen.getByText(`${productReviewCount} reviews`);
});
