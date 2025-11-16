import { useState, useEffect } from "react";
import {
  getTrendingBooks,
  getRecommendedForUser,
  rebuildUserProfile,
} from "../api/books";

// Custom hook for trending books data
export const useTrendingBooks = (limit = 15) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchTrending() {
      try {
        setLoading(true);
        setError(null);
        const response = await getTrendingBooks({
          limit,
          signal: controller.signal,
        });
        setData(response.trending || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch trending books:", err);
          setError("Failed to load trending books");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
    return () => controller.abort();
  }, [limit]);

  return { data, loading, error };
};

// Utility function to get userId from token
const getCurrentUserIdFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No auth token found in localStorage");
      return null;
    }

    console.log("Auth token found:", token);
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payloadBase64 = parts[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    return payload.id || payload._id || payload.userId || null;
  } catch (err) {
    console.error("Failed to extract userId from token", err);
    return null;
  }
};

// Custom hook for user recommendations
export const useRecommendations = (limit = 12) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId] = useState(() => getCurrentUserIdFromToken());

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchRecommendations() {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching recommendations for userId:", userId);
        let response = await getRecommendedForUser({
          userId,
          limit,
          signal: controller.signal,
        });

        // If there's no profile yet, build it once and retry
        if (response.reason === "no_profile") {
          try {
            await rebuildUserProfile({ userId, signal: controller.signal });
            response = await getRecommendedForUser({
              userId,
              limit: Math.min(limit, 9), // Reduce limit on retry
              signal: controller.signal,
            });
          } catch (innerErr) {
            console.error("Failed to rebuild profile:", innerErr);
          }
        }

        setData(response.items || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch recommendations:", err);
          setError("Failed to load recommendations");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
    return () => controller.abort();
  }, [userId, limit]);

  return { data, loading, error, userId };
};

// Custom hook for scroll functionality
export const useScrollToSection = () => {
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const scrollToTrending = () => scrollToSection("trending-section");

  return { scrollToSection, scrollToTrending };
};
