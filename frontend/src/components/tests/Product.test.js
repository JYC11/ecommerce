import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Product from "../Product";

it("should contain some product details", () => {
  const product = {
    _id: "1",
    name: "Airpods Wireless Bluetooth Headphones",
    image: "/images/airpods.jpg",
    description:
      "Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working",
    brand: "Apple",
    category: "Electronics",
    price: 89.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  };
  render(
    <MemoryRouter>
      <Product product={product} />
    </MemoryRouter>
  );

  screen.getByText(product.name);
  const image = screen.getByAltText(product.name);
  expect(image.src).toContain(product.image);
  screen.getByText(`$${String(product.price)}`);
});
