import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchPage from "./SearchPage";

// Mock the API used by SearchPage
jest.mock("../api/books", () => ({
  searchBooks: jest.fn(),
}));

import { searchBooks } from "../api/books";

// use fake timers to control the 300ms debounce
beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
  jest.resetAllMocks();
});

const typeAndWaitDebounce = async (value) => {
  fireEvent.change(screen.getByPlaceholderText(/harry potter/i), {
    target: { value },
  });
  // advance past 300ms debounce
  await act(async () => {
    jest.advanceTimersByTime(350);
  });
};

describe("SearchPage", () => {
  test("renders search input", () => {
    render(<SearchPage />);
    expect(
      screen.getByPlaceholderText(/harry potter/i)
    ).toBeInTheDocument();
  });

  test("shows results when API returns books", async () => {
    searchBooks.mockResolvedValueOnce({
      q: "harry",
      page: 1,
      limit: 12,
      hasMore: false,
      nextPage: null,
      items: [
        {
          googleBookId: "1",
          title: "Test Book",
          authors: ["Author One"],
          thumbnail: "https://example.com/one.jpg",
        },
      ],
    });

    render(<SearchPage />);
    await typeAndWaitDebounce("harry");

    expect(await screen.findByText("Test Book")).toBeInTheDocument();
    expect(screen.getByText("Author One")).toBeInTheDocument();
  });

  test("shows empty state when no items", async () => {
    searchBooks.mockResolvedValueOnce({
      q: "zzz",
      page: 1,
      limit: 12,
      hasMore: false,
      nextPage: null,
      items: [],
    });

    render(<SearchPage />);
    await typeAndWaitDebounce("zzz");

    expect(
      await screen.findByText(/no results for/i)
    ).toBeInTheDocument();
  });

  test("shows error state on failure", async () => {
    searchBooks.mockRejectedValueOnce(new Error("Server blew up"));

    render(<SearchPage />);
    await typeAndWaitDebounce("error");

    expect(
      await screen.findByText(/error: server blew up/i)
    ).toBeInTheDocument();
  });

  test("Load More appends items and disables when no more", async () => {
    // First page: has more
    searchBooks
      .mockResolvedValueOnce({
        q: "harry",
        page: 1,
        limit: 12,
        hasMore: true,
        nextPage: 2,
        items: [
          {
            googleBookId: "1",
            title: "Page 1 Book",
            authors: ["A1"],
            thumbnail: "https://example.com/1.jpg",
          },
        ],
      })
      // Second page: end
      .mockResolvedValueOnce({
        q: "harry",
        page: 2,
        limit: 12,
        hasMore: false,
        nextPage: null,
        items: [
          {
            googleBookId: "2",
            title: "Page 2 Book",
            authors: ["A2"],
            thumbnail: "https://example.com/2.jpg",
          },
        ],
      });

    render(<SearchPage />);
    await typeAndWaitDebounce("harry");

    // first result visible
    expect(await screen.findByText("Page 1 Book")).toBeInTheDocument();

    // click Load More
    const btn = screen.getByRole("button", { name: /load more/i });
    expect(btn).toBeEnabled();

    // Trigger second fetch
    await act(async () => {
      btn.click();
    });

    // second item appended
    expect(await screen.findByText("Page 2 Book")).toBeInTheDocument();

    // after second page, button should say no more or be disabled
    // (both acceptable depending on your UI)
    const maybeBtn = screen.queryByRole("button", { name: /load more/i });
    if (maybeBtn) {
      expect(maybeBtn).toBeDisabled();
    }
  });
});
