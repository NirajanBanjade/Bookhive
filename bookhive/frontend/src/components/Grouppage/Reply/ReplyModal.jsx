import React, { useState, useEffect } from "react";
import { X, Trash2, Send, Loader2 } from "lucide-react";
import {
  fetchReplies,
  createReply,
  deleteReply,
} from "../../../services/replyService";

const ReplyModal = ({
  post,
  category,
  currentUserId,
  onClose,
  formatDate,
  onReplyCountChange,
}) => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const authorName =
    post.userId?.name || post.userId?.username || "Unknown User";

  useEffect(() => {
    loadReplies();
  }, []);

  const loadReplies = async () => {
    try {
      setLoading(true);
      const data = await fetchReplies(category, post._id);
      setReplies(data.replies || []);
    } catch (err) {
      console.error("Error loading replies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReply.trim() || submitting) return;

    try {
      setSubmitting(true);
      const data = await createReply(category, post._id, newReply);
      setReplies([...replies, data.reply]);
      setNewReply("");

      if (onReplyCountChange) {
        onReplyCountChange(post._id, replies.length + 1);
      }
    } catch (err) {
      console.error("Error creating reply:", err);
      alert("Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (replyId) => {
    if (!window.confirm("Delete this reply?")) return;

    try {
      await deleteReply(category, post._id, replyId);
      setReplies(replies.filter((r) => r._id !== replyId));

      if (onReplyCountChange) {
        onReplyCountChange(post._id, replies.length - 1);
      }
    } catch (err) {
      console.error("Error deleting reply:", err);
      alert("Failed to delete reply");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ backgroundColor: "#2d2d2d", border: "1px solid #404040" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between border-b"
          style={{
            backgroundColor: "#1f1f1f",
            borderColor: "#404040",
          }}
        >
          <h2
            className="text-xl font-bold"
            style={{
              color: "#d4af37",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Replies
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Original Post */}
        <div
          className="px-6 py-4 border-b"
          style={{
            backgroundColor: "#252525",
            borderColor: "#404040",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
              style={{
                background: "linear-gradient(135deg, #8b7ff5 0%, #6c63ff 100%)",
                color: "#ffffff",
              }}
            >
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p
                className="font-semibold text-sm"
                style={{
                  color: "#e5e5e5",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {authorName}
              </p>
              <p className="text-xs" style={{ color: "#a0a0a0" }}>
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "#e5e5e5",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {post.content}
          </p>
        </div>

        {/* Replies Section */}
        <div
          className="flex-1 overflow-y-auto px-6 py-4"
          style={{ backgroundColor: "#2d2d2d" }}
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "#a0a0a0" }}
          >
            {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
          </h3>

          {loading ? (
            <div className="text-center py-12">
              <Loader2
                className="inline-block animate-spin mb-2"
                size={32}
                style={{ color: "#d4af37" }}
              />
              <p className="text-sm" style={{ color: "#a0a0a0" }}>
                Loading replies...
              </p>
            </div>
          ) : replies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: "#a0a0a0" }}>
                No replies yet. Be the first to reply!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {replies.map((reply) => {
                const replyAuthor =
                  reply.userId?.name || reply.userId?.username || "Unknown";
                const isMyReply = reply.userId?._id === currentUserId;

                return (
                  <div
                    key={reply._id}
                    className={`flex ${
                      isMyReply ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className="rounded-2xl p-4 max-w-[75%]"
                      style={{
                        background: isMyReply
                          ? "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)"
                          : "#3a3a3a",
                        border: isMyReply ? "none" : "1px solid #404040",
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                            style={{
                              background: isMyReply
                                ? "rgba(0, 0, 0, 0.2)"
                                : "linear-gradient(135deg, #8b7ff5 0%, #6c63ff 100%)",
                              color: isMyReply ? "#1a1a1a" : "#ffffff",
                            }}
                          >
                            {replyAuthor.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p
                              className="font-semibold text-xs"
                              style={{
                                color: isMyReply ? "#1a1a1a" : "#e5e5e5",
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              {replyAuthor}
                            </p>
                            <p
                              className="text-xs"
                              style={{
                                color: isMyReply ? "#4a4a2a" : "#a0a0a0",
                              }}
                            >
                              {formatDate(reply.createdAt)}
                            </p>
                          </div>
                        </div>
                        {isMyReply && (
                          <button
                            onClick={() => handleDelete(reply._id)}
                            className="p-1.5 rounded-lg transition-all ml-2 flex-shrink-0"
                            style={{
                              backgroundColor: "rgba(0, 0, 0, 0.2)",
                              color: "#8b0000",
                            }}
                            title="Delete reply"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: isMyReply ? "#1a1a1a" : "#e5e5e5",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {reply.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reply Input */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 border-t"
          style={{
            backgroundColor: "#252525",
            borderColor: "#404040",
          }}
        >
          <textarea
            placeholder="Write a reply..."
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            rows={3}
            maxLength={2000}
            disabled={submitting}
            className="w-full px-4 py-3 rounded-xl resize-none focus:outline-none focus:ring-2 transition-all mb-3"
            style={{
              backgroundColor: "#3a3a3a",
              border: "1px solid #555555",
              color: "#e5e5e5",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
            }}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs" style={{ color: "#a0a0a0" }}>
              {newReply.length} / 2000
            </span>
            <button
              type="submit"
              disabled={!newReply.trim() || submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              style={{
                background:
                  !newReply.trim() || submitting
                    ? "#404040"
                    : "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)",
                color: !newReply.trim() || submitting ? "#808080" : "#1a1a1a",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Posting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Reply
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyModal;
