import { render, screen } from "@testing-library/react";
import ListingItem from "../components/ListingItem";
import { BrowserRouter } from "react-router-dom";

const mockListing = {
  _id: "1",
  name: "Sample Listing",
  address: "123 Main St",
  description: "A beautiful property",
  offer: true,
  discountPrice: 1000,
  regularPrice: 1200,
  type: "rent",
  bedrooms: 3,
  bathrooms: 2,
  imageUrls: ["https://image/cp,/123"],
  furnished: true,
  parking: true,
  userRef: "Sample",
};

it("renders ListingItem component", () => {
  render(
    <BrowserRouter>
      <ListingItem listing={mockListing} />
    </BrowserRouter>
  );

  expect(screen.getByText("Sample Listing")).toBeInTheDocument();
  expect(screen.getByText("123 Main St")).toBeInTheDocument();
  expect(screen.getByText("A beautiful property")).toBeInTheDocument();
  expect(screen.getByText("$1,000 / month")).toBeInTheDocument();
  expect(screen.getByText("3 beds")).toBeInTheDocument();
  expect(screen.getByText("2 baths")).toBeInTheDocument();
});
