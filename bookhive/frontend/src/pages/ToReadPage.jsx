import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ToReadPage = () => {
  const [books, setBooks] = useState([]);
  const userId = 'user123'; // replace with actual logged-in user ID

  // Add a demo book
  const handleAddBook = async () => {
    const demoBook = {
      googleBookId: `demo-${Date.now()}`, // unique per click
      title: 'Demo Book',
      authors: ['Jane Doe'],
      thumbnail: 'https://example.com/image.jpg',
    };

    try {
      const response = await axios.post(
        `http://localhost:5050/api/to-read/${userId}`,
        demoBook // send fields directly, NOT wrapped in 'book'
      );
      console.log('Book added:', response.data.books || response.data.list?.books);
      setBooks(response.data.books || response.data.list?.books);
    } catch (err) {
      console.error('Error adding book:', err.response?.data || err);
      alert(err.response?.data?.message || 'Failed to add book');
    }
  };

   // Remove a book
  const handleRemoveBook = async (bookId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5050/api/to-read/${userId}/${bookId}`
      );
      setBooks(response.data.list.books);
      alert('Book removed from your To-Read list');
    } catch (err) {
      console.error('Error removing book:', err.response?.data || err);
      alert(err.response?.data?.message || 'Failed to remove book');
    }
  };

  // Fetch user's to-read list
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/to-read/${userId}`);
        setBooks(response.data.books || []);
      } catch (err) {
        console.error('Error fetching to-read list:', err);
      }
    };

    fetchBooks();
  }, [userId]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>To-Read List</h1>

      <button onClick={handleAddBook}>Add Demo Book</button>

      {books.length === 0 ? (
        <p>No books yet. Go add some!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {books.map((book) => (
            <li
              key={book.googleBookId}
              style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}
            >
              <img src={book.thumbnail} alt={book.title} width={50} />
              <div>
                <strong>{book.title}</strong> by {book.authors.join(', ')}
                <div style={{ marginTop: 4 }}>
                  <button
                    onClick={() => handleRemoveBook(book.googleBookId)}
                    style={{ padding: '4px 8px' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ToReadPage;
