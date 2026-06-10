import { useState, useEffect, useCallback } from "react";
import axios from "axios";

/**
 * Custom hook for managing user's favorite books
 * Handles fetching favorites, toggling favorite status, and managing full book data
 */
export const useFavorites = (userId) => {
  const [favorites, setFavorites] = useState(new Set());
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch favorites when userId is available
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `/api/favorites/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        // Store full book objects for display
        setFavoriteBooks(response.data);
        
        // Store just IDs in Set for quick lookup
        setFavorites(new Set(response.data.map((fav) => fav.googleBookId)));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  // Toggle favorite status - actually add/remove from backend
  const toggleFavorite = useCallback(async (bookData) => {
    if (!userId) return;

    const { googleBookId, title, authors, thumbnail, categories } = bookData;

    try {
      const token = localStorage.getItem("token");
      
      // Call toggle endpoint
      const response = await axios.post(
        `/api/favorites/${userId}/toggle`,
        {
          googleBookId,
          title,
          authors: authors || [],
          thumbnail: thumbnail || null,
          categories: categories || []
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { action, isFavorited } = response.data;

      // Update local state
      if (action === 'added') {
        // Add to favorites Set
        setFavorites(prev => new Set([...prev, googleBookId]));
        
        // Add to favoriteBooks array
        setFavoriteBooks(prev => [...prev, {
          googleBookId,
          title,
          authors,
          thumbnail,
          categories,
          addedAt: new Date().toISOString()
        }]);
      } else if (action === 'removed') {
        // Remove from favorites Set
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(googleBookId);
          return newSet;
        });
        
        // Remove from favoriteBooks array
        setFavoriteBooks(prev => prev.filter(book => book.googleBookId !== googleBookId));
      }

      // Trigger notification refresh
      window.dispatchEvent(new Event("notifications:refresh"));

      return { action, isFavorited };
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  }, [userId]);

  // Legacy handler for compatibility (will be removed in Phase 3)
  const handleToggleFavorite = useCallback((googleBookId, e) => {
    if (e) e.stopPropagation();
    return googleBookId;
  }, []);

  return {
    favorites,
    favoriteBooks,
    loading,
    setFavorites,
    toggleFavorite,
    handleToggleFavorite, // Keep for compatibility during transition
  };
};