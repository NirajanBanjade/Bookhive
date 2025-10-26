import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ToReadPage = () => {
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState(null); // Get from logged-in user
  const [loading, setLoading] = useState(true);

  // Fetch the logged-in user's ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please login first');
          window.location.href = '/login';
          return;
        }

        // Get current user info
        const response = await axios.get('http://localhost:5050/api/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserId(response.data._id || response.data.id);
      } catch (err) {
        console.error('Error fetching user:', err);
        alert('Please login first');
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch user's to-read list
  useEffect(() => {
    if (!userId) return;

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

  // Add a demo book
  const handleAddBook = async () => {
    if (!userId) {
      alert('Please wait, loading user info...');
      return;
    }

    const demoBook = {
      googleBookId: `demo-${Date.now()}`,
      title: 'Demo Book',
      authors: ['Jane Doe'],
      thumbnail: 'https://example.com/image.jpg',
    };

    try {
      const response = await axios.post(
        `http://localhost:5050/api/to-read/${userId}`,
        demoBook
      );
      console.log('Book added:', response.data.books || response.data.list?.books);
      setBooks(response.data.books || response.data.list?.books);
      
      // Trigger notification refresh
      window.dispatchEvent(new Event('notifications:refresh'));
      
      alert('Book added! Check your notifications');
    } catch (err) {
      console.error('Error adding book:', err.response?.data || err);
      alert(err.response?.data?.message || 'Failed to add book');
    }
  };

  // Remove a book
  const handleRemoveBook = async (bookId) => {
    if (!userId) return;

    try {
      const response = await axios.delete(
        `http://localhost:5050/api/to-read/${userId}/${bookId}`
      );
      setBooks(response.data.list.books);
      
      // Trigger notification refresh
      window.dispatchEvent(new Event('notifications:refresh'));
      
      alert('Book removed from your To-Read list');
    } catch (err) {
      console.error('Error removing book:', err.response?.data || err);
      alert(err.response?.data?.message || 'Failed to remove book');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (!userId) {
    return <div style={{ padding: '20px' }}>Please login first</div>;
  }

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