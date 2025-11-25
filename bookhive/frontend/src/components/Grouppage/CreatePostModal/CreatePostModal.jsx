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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5 flex items-center justify-between rounded-t-2xl">
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Create Post
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 transition-colors p-2 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What's on your mind?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={6}
              maxLength={3000}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
            <div className="text-right text-sm text-gray-500 mt-2">
              {content.length} / 3000
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Link (optional)
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
