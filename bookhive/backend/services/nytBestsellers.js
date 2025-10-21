// services/nytBestsellers.js

const NYT_API_KEY = process.env.NYT_API_KEY || "YOUR_API_KEY_HERE";
const NYT_BASE_URL = "https://api.nytimes.com/svc/books/v3";

/**
 * Fetch bestseller list from NYT
 * @param {string} listName - e.g., 'combined-print-and-e-book-fiction'
 * @returns {Promise<Array>} Array of bestselling books
 */
async function getBestsellerList(
  listName = "combined-print-and-e-book-fiction"
) {
  try {
    const url = `${NYT_BASE_URL}/lists/current/${listName}.json?api-key=${NYT_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NYT API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || !data.results.books) {
      return [];
    }

    // Map NYT data to our format
    return data.results.books.map((book) => ({
      title: book.title,
      authors: [book.author],
      description: book.description,
      thumbnail: book.book_image,
      isbn: book.primary_isbn13,
      rank: book.rank,
      weeksOnList: book.weeks_on_list,
      publisher: book.publisher,
    }));
  } catch (error) {
    console.error("Error fetching NYT bestsellers:", error);
    throw error;
  }
}

module.exports = {
  getBestsellerList,
};
