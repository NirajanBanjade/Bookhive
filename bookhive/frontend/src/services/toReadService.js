// frontend/src/services/toReadService.js
import http from "../api/http"; // uses baseURL + JWT interceptor

const BASE = "/to-read";

export const getToReadBooks = async (userId) => {
  try {
    const { data } = await http.get(`${BASE}/${userId}`);
    return data.books || [];
  } catch (err) {
    console.error("Fetch To-Read failed:", err);
    throw err;
  }
};

export const addDemoBookToRead = async (userId) => {
  try {
    const demoBook = {
      googleBookId: `demo-${Date.now()}`,
      title: `Test Book ${Date.now()}`,
      authors: ["Jane Doe"],
      thumbnail: "https://example.com/image.jpg",
    };
    const { data } = await http.post(`${BASE}/${userId}`, demoBook);

    // trigger instant bell refresh
    window.dispatchEvent(new Event("notifications:refresh"));

    return data.books || [];
  } catch (err) {
    console.error("Add demo book failed:", err);
    throw err.response?.data?.error || "Failed to add demo book";
  }
};

export const removeBookFromToRead = async (userId, googleBookId) => {
  try {
    const { data } = await http.delete(`${BASE}/${userId}/${googleBookId}`);

    // 🔔 trigger instant bell refresh
    window.dispatchEvent(new Event("notifications:refresh"));

    return data.list?.books || [];
  } catch (err) {
    console.error("Remove book failed:", err);
    throw err.response?.data?.error || "Failed to remove book";
  }
};
