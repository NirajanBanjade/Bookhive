import React from "react";
import { Sparkles } from "lucide-react";
import { useRecommendations } from "../../hooks/useBookData";
import BookCard from "../BookCard/BookCard";
import HorizontalScroll from "../HorizontalScroll/HorizontalScroll";

const RecommendationsWidget = () => {
  const { data: recommendations, loading, error } = useRecommendations(12);

  return (
    <section className="content-section recommendations-section library-collection">
      <div className="section-divider recommendations-divider"></div>
      <div className="section-container">
        <div className="section-header">
          <div className="section-icon recommendations-icon">
            <Sparkles className="icon" />
          </div>
          <div className="section-text">
            <h2 className="section-title">Your Curated Collection</h2>
            <p className="section-subtitle">
              Handpicked recommendations just for you
            </p>
          </div>
        </div>

        <div className="carousel-wrapper">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading recommendations...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="empty-state">
              <p>No recommendations yet. Add books to your To-Read list!</p>
            </div>
          ) : (
            <HorizontalScroll speed={0.3} autoScroll={true}>
              {recommendations.map((item) => {
                const v = item.volumeInfo || {};
                return (
                  <BookCard
                    key={item.id}
                    book={{
                      title: v.title,
                      authors: v.authors,
                      thumbnail:
                        v.imageLinks?.thumbnail ||
                        v.imageLinks?.smallThumbnail,
                    }}
                    showRank={false}
                  />
                );
              })}
            </HorizontalScroll>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecommendationsWidget;

