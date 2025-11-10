import React, { useState, useEffect } from "react"; // 🆕 Added useState, useEffect
import {
  Heart,
  MessageCircle,
  Star,
  Sparkles,
  BookOpen,
  Target,
  TrendingUp,
  Calendar,
  Flame, // 🆕 Added Flame icon for trending
} from "lucide-react";
import { getTrendingBooks, getRecommendedForUser, rebuildUserProfile } from "../../api/books"; 
import { ChevronDown } from "lucide-react";
import BookCard from "../BookCard/BookCard";
import HorizontalScroll from "../HorizontalScroll/HorizontalScroll";
import Footer from "../Footer/Footer";

import "./HomePage.css";

// Try to get the current user's id from a JWT stored in localStorage.
function getCurrentUserIdFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token){
      console.log("No auth token found in localStorage");
      return null;
    }

    console.log("Auth token found:", token);
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payloadBase64 = parts[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    // Support a few common shapes: { id: ... }, { _id: ... }, { userId: ... }
    return payload.id || payload._id || payload.userId || null;
  } catch (err) {
    console.error("Failed to extract userId from token", err);
    return null;
  }
};

const HomePage = () => {
  // Trending state
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState(null);

  // Recommendations state
  const [recs, setRecs] = useState([]);
  const [recsLoading, setRecsLoading] = useState(true);
  const [recsError, setRecsError] = useState(null);

  // Get userId from token
  const [ userId ] = useState(() => getCurrentUserIdFromToken());

  // Fetch trending books
  useEffect(() => {
    const controller = new AbortController();

    async function fetchTrending() {
      try {
        setTrendingLoading(true);
        const data = await getTrendingBooks({
          limit: 15,
          signal: controller.signal,
        });
        setTrendingBooks(data.trending || []);
        setTrendingError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch trending books:", err);
          setTrendingError("Failed to load trending books");
        }
      } finally {
        setTrendingLoading(false);
      }
    }

    fetchTrending();
    return () => controller.abort();
  }, []);

  // Fetch recommendations
  useEffect(() => {
    const controller = new AbortController();

    async function fetchRecs() {
      try {
        console.log("Fetching recommendations for userId:", userId);
        setRecsLoading(true);
        const data = await getRecommendedForUser({
          userId,
          limit: 12,
          signal: controller.signal,
        });

        // 2) If there's no profile yet, build it once and retry
        if (data.reason === "no_profile") {
          try {
            await rebuildUserProfile({ userId, signal: controller.signal });
            data = await getRecommendedForUser({
              userId,
              limit: 9,
              signal: controller.signal,
            });
          } catch (innerErr) {
            console.error("Failed to rebuild profile:", innerErr);
          }
        }

        setRecs(data.items || []);
        setRecsError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch recommendations:", err);
          setRecsError("Failed to load recommendations");
        }
      } finally {
        setRecsLoading(false);
      }
    }

    if (userId) fetchRecs();
    return () => controller.abort();
  }, [userId]);

  const scrollToTrending = () => {
    document.getElementById("trending-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="homepage">
      {/* Library Entrance - Hero Section */}
      <section className="hero-section library-entrance">
        <div className="hero-background">
          <div className="floating-books">
            <span className="float-book book-1">📚</span>
            <span className="float-book book-2">📖</span>
            <span className="float-book book-3">📕</span>
            <span className="float-book book-4">📗</span>
            <span className="float-book book-5">📘</span>
            <span className="float-book book-6">📙</span>
          </div>
          <div className="library-shelves">
            <div className="shelf shelf-1"></div>
            <div className="shelf shelf-2"></div>
            <div className="shelf shelf-3"></div>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🐝</span>
            Your Personal Reading Companion
          </div>

          <h1 className="hero-title">
            Welcome to <span className="title-highlight">BookHive</span>
          </h1>

          <p className="hero-subtitle">
            Your cozy corner for tracking reads, discovering new favorites, and
            connecting with fellow book lovers
          </p>

          <div className="hero-message">
            <div className="message-item">
              <span className="message-icon">📚</span>
              <span className="message-text">Track your reading journey</span>
            </div>
            <div className="message-item">
              <span className="message-icon">✨</span>
              <span className="message-text">Discover your next favorite</span>
            </div>
            <div className="message-item">
              <span className="message-icon">🤝</span>
              <span className="message-text">
                Connect with readers worldwide
              </span>
            </div>
          </div>

          <button className="hero-cta" onClick={scrollToTrending}>
            <span>Explore the Library</span>
            <ChevronDown className="cta-icon" />
          </button>
        </div>

        <div className="scroll-indicator" onClick={scrollToTrending}>
          <span className="scroll-text">Enter the library</span>
          <ChevronDown className="scroll-arrow" />
        </div>
      </section>

      {/* Trending Gallery - Popular Reads Section */}
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
            {trendingLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading trending books...</p>
              </div>
            ) : trendingError ? (
              <div className="error-state">
                <p>{trendingError}</p>
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

      {/* Curated Collection - Recommendations Section */}
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
            {recsLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading recommendations...</p>
              </div>
            ) : recsError ? (
              <div className="error-state">
                <p>{recsError}</p>
              </div>
            ) : recs.length === 0 ? (
              <div className="empty-state">
                <p>No recommendations yet. Add books to your To-Read list!</p>
              </div>
            ) : (
              <HorizontalScroll speed={0.3} autoScroll={true}>
                {recs.map((item) => {
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

      {/* Simple Library Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
