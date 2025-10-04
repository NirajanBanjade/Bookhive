import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ToReadPage = () => {
  const [books, setBooks] = useState([]);
  const userId = 'user123'; // replace with actual logged-in user ID

  useEffect(() => {
    // Fetch user's to-read list
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/to-read/${userId}`);
        setBooks(response.data.books);
      } catch (err) {
        console.error('Error fetching to-read list:', err);
      }
    };

    fetchBooks();
  }, [userId]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>To-Read List</h1>
      {books.length === 0 ? (
        <p>No books yet. Go add some!</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.googleBookId}>
              <img src={book.thumbnail} alt={book.title} width={50} />
              <strong>{book.title}</strong> by {book.authors.join(', ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ToReadPage;
