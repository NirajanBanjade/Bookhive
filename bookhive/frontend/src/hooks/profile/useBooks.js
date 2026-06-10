import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Custom hook for managing user's books
 * Handles fetching books, status changes, removal, and category joining
 */
export const useBooks = (userId) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch books when userId is available
  useEffect(() => {
    const fetchBooks = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [toReadRes, collectionsRes] = await Promise.all([
          axios.get(`/api/to-read/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/collections/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const toReadBooks = (toReadRes.data.books || []).map((book) => ({
          ...book,
          status: "want-to-read",
        }));

        const collectionBooks = collectionsRes.data.books || [];

        setBooks([...toReadBooks, ...collectionBooks]);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [userId]);

  // Remove a book from the list
  const handleRemove = async (googleBookId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");

      if (currentStatus === "want-to-read") {
        await axios.delete(
          `/api/to-read/${userId}/${googleBookId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(
          `/api/collections/${userId}/${googleBookId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setBooks((prev) =>
        prev.filter((book) => book.googleBookId !== googleBookId)
      );

      window.dispatchEvent(new Event("notifications:refresh"));

      alert("Book removed");
    } catch (error) {
      console.error("Error removing book:", error);
      alert("Failed to remove book");
    }
  };

  // Change book status (want-to-read, currently-reading, completed)
  const handleStatusChange = async (googleBookId, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;

    try {
      const token = localStorage.getItem("token");

      if (currentStatus === "want-to-read") {
        await axios.post(
          `/api/to-read/${userId}/${googleBookId}/move`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.patch(
          `/api/collections/${userId}/${googleBookId}`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setBooks((prev) =>
        prev.map((book) =>
          book.googleBookId === googleBookId
            ? { ...book, status: newStatus }
            : book
        )
      );

      window.dispatchEvent(new Event("notifications:refresh"));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  // Join a category group
  const handleCategoryJoin = async (categoryKey) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `/api/groups/${encodeURIComponent(
          categoryKey
        )}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: categoryKey }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join group");
      }

      const data = await response.json();

      if (data.alreadyMember) {
        alert(`You are already a member of ${categoryKey}`);
      } else {
        alert(`Successfully joined ${categoryKey} group!`);
      }

      window.dispatchEvent(new Event("notifications:refresh"));
    } catch (error) {
      console.error("Error joining group:", error);
      alert(error.message || "Failed to join group");
    }
  };

  return {
    books,
    loading,
    setBooks,
    handleRemove,
    handleStatusChange,
    handleCategoryJoin,
  };
};