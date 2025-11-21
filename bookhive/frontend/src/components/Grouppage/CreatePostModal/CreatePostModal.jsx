import React, { useState } from "react";
import { X, Loader2, Send } from "lucide-react";

const CreatePostModal = ({ category, onClose, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Please enter some content");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`/api/groups/${category}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          linkUrl: linkUrl.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create post");
      }

      const data = await res.json();
      onPostCreated(data.post);
      setContent("");
      setLinkUrl("");
      onClose();
    } catch (err) {
      console.error("Error creating post:", err);
      alert(err.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 px-6 py-5 flex items-center justify-between rounded-t-2xl"
          style={{
            background: "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)",
          }}
        >
          <h2
            className="text-2xl font-bold"
            style={{
              color: "#fbbf24",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Create Post
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label
              className="block text-sm font-bold mb-2"
              style={{
                color: "#1a202c",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              What's on your mind?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={6}
              maxLength={3000}
              required
              className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 resize-none transition-all shadow-sm"
              style={{
                backgroundColor: "#ffffff",
                border: "2px solid #d6d3d1",
                fontFamily: "'Inter', sans-serif",
                color: "#1a202c",
              }}
            />
            <div
              className="text-right text-sm mt-2"
              style={{ color: "#78716c" }}
            >
              {content.length} / 3000
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-bold mb-2"
              style={{
                color: "#1a202c",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Link (optional)
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm"
              style={{
                backgroundColor: "#ffffff",
                border: "2px solid #d6d3d1",
                fontFamily: "'Inter', sans-serif",
                color: "#1a202c",
              }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-6 py-3 rounded-xl transition-all font-bold disabled:opacity-50 shadow-md"
              style={{
                backgroundColor: "#d6d3d1",
                color: "#1a202c",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="flex-1 px-6 py-3 rounded-xl transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                color: "#1a202c",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Posting...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
