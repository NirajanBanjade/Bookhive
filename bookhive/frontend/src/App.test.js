import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// silence noisy router future warnings (optional)
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...a) => {
    if (String(a[0]).includes("React Router Future Flag Warning")) return;
    originalWarn(...a);
  };
});
afterAll(() => { console.warn = originalWarn; });

jest.mock("axios", () => {
  const m = { get: jest.fn(), post: jest.fn(), create: jest.fn(() => m) };
  return { __esModule: true, default: m, ...m };
});
jest.mock("./pages/ToReadPage", () => () => <div>To Read</div>);
// mock SearchPage lightly for a stable assertion after navigation
jest.mock("./pages/SearchPage", () => () => <div>Search Books</div>);

import App from "./App";

test("renders Profile by default and navigates to Search", async () => {
  render(<App />);

  // Landing page is Profile – target the heading, not the nav link
  expect(screen.getByRole("heading", { name: /profile/i })).toBeInTheDocument();

  // Navigate to Search and assert SearchPage renders
  await userEvent.click(screen.getByRole("link", { name: /search/i }));
  expect(await screen.findByText(/search books/i)).toBeInTheDocument();
});
