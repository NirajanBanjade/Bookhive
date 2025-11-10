import React from "react";
import "./BookCard.css";

const BookCard = ({ book, showRank = false, rank }) => {
  const title = book.title || book.volumeInfo?.title || "Untitled";
  const author =
    book.authors?.[0] || book.volumeInfo?.authors?.[0] || "Unknown Author";
  const thumbnail = book.thumbnail || book.volumeInfo?.imageLinks?.thumbnail;
  const weeksOnList = book.weeksOnList;

  return (
    <div className="book-card">
      {showRank && rank && <div className="book-rank-badge">{rank}</div>}
      <div className="book-cover-container">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="book-cover" />
        ) : (
          <div className="book-cover-placeholder">📚</div>
        )}
      </div>
      <div className="book-info">
        <h4 className="book-title">{title}</h4>
        <p className="book-author">{author}</p>
        {weeksOnList > 0 && (
          <p className="book-weeks">
            🔥 {weeksOnList} week{weeksOnList !== 1 ? "s" : ""} on list
          </p>
        )}
      </div>
    </div>
  );
};

export default BookCard;
