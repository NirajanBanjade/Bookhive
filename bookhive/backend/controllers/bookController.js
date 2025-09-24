const axios = require('axios');

const searchBooks = async (req, res) => {
  try {
    const { title } = req.query; // grab the search term from the query string
    if (!title) return res.status(400).json({ error: 'Title is required' });

    // Call Google Books API
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: { q: title }
    });

    // Map the results to only the fields we want
    const books = response.data.items.map(item => ({
      googleBookId: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      publishedDate: item.volumeInfo.publishedDate,
      description: item.volumeInfo.description,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || ''
    }));

    res.json(books); // send the array of books to the frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching books from Google API' });
  }
};

module.exports = { searchBooks };