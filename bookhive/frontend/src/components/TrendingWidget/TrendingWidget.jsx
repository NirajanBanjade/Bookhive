import React from "react";
import { Flame } from "lucide-react";
import { useTrendingBooks } from "../../hooks/useBookData";
import BookCard from "../BookCard/BookCard";
import HorizontalScroll from "../HorizontalScroll/HorizontalScroll";

const TrendingWidget = () => {
  const { data: trendingBooks, loading, error } = useTrendingBooks(15);

  return (
    <section
      id="trending-section"
      className="content-section trending-section library-gallery"
    >
      <div className="section-divider trending-divider"></div>
      <div className="section-container">
        <div className="section-header">
          <div className="section-icon trending-icon">
            <Flame className="icon" />
          </div>
          <div className="section-text">
            <h2 className="section-title">Popular Reads Gallery</h2>
            <p className="section-subtitle">
              Discover what thousands of readers are loving right now
            </p>
          </div>
        </div>

        <div className="carousel-wrapper">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading trending books...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : trendingBooks.length === 0 ? (
            <div className="empty-state">
              <p>No trending books available</p>
            </div>
          ) : (
            <HorizontalScroll speed={0.5} autoScroll={true}>
              {trendingBooks.map((book, index) => (
                <BookCard
                  key={book.isbn || index}
                  book={book}
                  showRank={true}
                  rank={book.rank || index + 1}
                />
              ))}
            </HorizontalScroll>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingWidget;
