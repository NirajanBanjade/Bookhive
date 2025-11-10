import React from "react";
import { Heart, BookOpen } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="library-footer">
      {/* Footer Divider */}
      <div className="footer-divider">
        <div className="divider-ornament">📚</div>
      </div>

      <div className="footer-content">
        {/* Main Footer Section */}
        <div className="footer-main">
          {/* BookHive Branding */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">🐝</span>
              <span className="logo-text">BookHive</span>
            </div>
            <p className="footer-tagline">
              Your cozy corner for discovering, tracking, and sharing your
              reading journey
            </p>
            <div className="footer-social">
              <span className="social-text">
                <BookOpen className="book-icon" />
                Join thousands of book lovers
              </span>
            </div>
          </div>

          {/* Library Hours & Stats */}
          <div className="footer-info">
            <h3 className="footer-section-title">
              <span className="library-icon">🏛️</span>
              Digital Library
            </h3>
            <div className="library-hours">
              <p className="hours-text">Always Open</p>
              <p className="hours-subtitle">24/7 Reading Experience</p>
              <div className="footer-stats">
                <div className="stat-item">
                  <span className="stat-number">∞</span>
                  <span className="stat-label">Books</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">📖</span>
                  <span className="stat-label">Stories</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">🌟</span>
                  <span className="stat-label">Dreams</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p className="copyright-text">
                © {currentYear} BookHive. Made with
                <Heart className="heart-icon" />
                for book lovers everywhere.
              </p>
            </div>
            <div className="footer-version">
              <span className="version-text">v1.0.0 - Reading Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Library Elements */}
      <div className="footer-decoration">
        <div className="decoration-books">
          <span className="deco-book book-1">📚</span>
          <span className="deco-book book-2">📖</span>
          <span className="deco-book book-3">📕</span>
          <span className="deco-book book-4">📘</span>
          <span className="deco-book book-5">📙</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
