import React from "react";
import { ChevronDown } from "lucide-react";

const HeroSection = ({ onScrollToTrending }) => {
  return (
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
            <span className="message-text">Connect with readers worldwide</span>
          </div>
        </div>

        <button className="hero-cta" onClick={onScrollToTrending}>
          <span>Explore the Library</span>
          <ChevronDown className="cta-icon" />
        </button>
      </div>

      <div className="scroll-indicator" onClick={onScrollToTrending}>
        <ChevronDown className="scroll-arrow" />
      </div>
    </section>
  );
};

export default HeroSection;
