import React, { useState } from 'react';

function BookSearch({ onSearch }) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if(!query.trim()) {
            setError('Please enter a book title');
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch (`http://localhost:5000/api/books/search?title=${encodeURIComponent(query)}`);

            if(!response.ok) {
                throw new Error('Failed to fetch books');
            }

            const data = await response.json();
            setResults(data.items || []);
        }
        catch (err) {
            setError(err.message || 'Something went wrong');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div style={{padding: "1rem"}}>
            <h2> Search for Books</h2>
            <form onSubmit={handleSearch}>
                <input 
                    type="text"
                    placeholder="Enter book title"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{padding: "0.5rem", marginRight: "0.5rem"}}
                />
                <button type="submit">Search</button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p style={{color: "red"}}>{error}</p>}

            <div style={{marginTop: "1rem"}}>
                {results.length > 0 ? (
                    <ul style={{listStyle: "none", padding: 0}}>
                        {results.map((book) => (
                            <li
                                key={book.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "1rem",
                                }}
                            >
                                {book.thumbnail && (
                                    <img
                                        src={book.thumbnail}
                                        alt={book.title}
                                        style={{width: "60px", marginRight: "1rem"}}
                                    />
                                )}

                                <div>
                                    <h4>{book.title}</h4>
                                    <p>
                                        {book.authors?.join(", ") || "Unknown Author"} (
                                        {book.publishedDate || "N/A"})
                                    </p>

                                    {book.infoLink && (
                                        <a
                                            href={book.infoLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{color: "blue"}}
                                        >
                                            More Info
                                        </a>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loading && <p>No books found</p>
                )}
            </div>
        </div>
    );
}

export default BookSearch;