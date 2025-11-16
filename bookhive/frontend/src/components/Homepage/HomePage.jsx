import React from "react";
import { useScrollToSection } from "../../hooks/useBookData";
import HeroSection from "../HeroSection/HeroSection";
import TrendingWidget from "../TrendingWidget/TrendingWidget";
import RecommendationsWidget from "../RecommendationsWidget/RecommendationsWidget";
import Footer from "../Footer/Footer";
import "./HomePage.css";

const HomePage = () => {
  const { scrollToTrending } = useScrollToSection();

  return (
    <div className="homepage">
      {/* Library Entrance - Hero Section */}
      <HeroSection onScrollToTrending={scrollToTrending} />

      {/* Trending Gallery - Popular Reads Section */}
      <TrendingWidget />

      {/* Curated Collection - Recommendations Section */}
      <RecommendationsWidget />

      {/* Simple Library Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
