import { useState, useEffect, useCallback } from "react";
import axios from "axios";

/**
 * Custom hook for managing user's favorite books
 * Handles fetching favorites and toggling favorite status
 */
export const useFavorites = (userId) => {
  const [favorites, setFavorites] = useState(new Set());

  // Fetch favorites when userId is available
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;
      
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5050/api/favorites/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFavorites(new Set(response.data.map((fav) => fav.googleBookId)));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [userId]);

  // Toggle favorite status (opens modal in current implementation)
  const handleToggleFavorite = useCallback((googleBookId, e) => {
    if (e) e.stopPropagation();
    // This will trigger the modal to open in the parent component
    // The parent should pass a callback to set selectedBookId
    return googleBookId;
  }, []);

  return {
    favorites,
    setFavorites,
    handleToggleFavorite,
  };
};