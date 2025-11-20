import React, { useState, useEffect } from 'react';
import { X, Trash2, Send, Loader2 } from 'lucide-react';
import { fetchReplies, createReply, deleteReply } from '../../../services/replyService';
import './ReplyModal.css';

const ReplyModal = ({ post, category, currentUserId, onClose, formatDate,onReplyCountChange  }) => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const authorName = post.userId?.name || post.userId?.username || 'Unknown User';

  useEffect(() => {
    loadReplies();
  }, []);

  const loadReplies = async () => {
    try {
      setLoading(true);
      const data = await fetchReplies(category, post._id);
      setReplies(data.replies || []);
    } catch (err) {
      console.error('Error loading replies:', err);
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
      setNewReply('');
      
      // Notify parent of count change
      if (onReplyCountChange) {
        onReplyCountChange(post._id, replies.length + 1);
      }
    } catch (err) {
      console.error('Error creating reply:', err);
      alert('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    
    try {
      await deleteReply(category, post._id, replyId);
      setReplies(replies.filter(r => r._id !== replyId));
      
      // Notify parent of count change
      if (onReplyCountChange) {
        onReplyCountChange(post._id, replies.length - 1);
      }
    } catch (err) {
      console.error('Error deleting reply:', err);
      alert('Failed to delete reply');
    }
  };

  return (
    <div className="reply-modal-overlay" onClick={onClose}>
      <div className="reply-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="reply-modal-header">
          <h2>Replies</h2>
          <button className="close-button" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Original Post */}
        <div className="original-post">
          <div className="post-author-info">
            <div className="author-avatar">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="author-name">{authorName}</p>
              <p className="post-time">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          <p className="post-text">{post.content}</p>
        </div>

        {/* Replies List */}
        <div className="replies-section">
          <h3 className="replies-count">{replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}</h3>
          
          {loading ? (
            <div className="loading-state">
              <Loader2 className="loading-spinner" />
            </div>
          ) : replies.length === 0 ? (
            <div className="empty-replies">
              <p>No replies yet. Be the first to reply!</p>
            </div>
          ) : (
            <div className="replies-list">
              {replies.map((reply) => {
                const replyAuthor = reply.userId?.name || reply.userId?.username || 'Unknown';
                const isReplyAuthor = reply.userId?._id === currentUserId;
                
                return (
                  <div key={reply._id} className="reply-item">
                    <div className="reply-header">
                      <div className="reply-author-info">
                        <div className="author-avatar small">
                          {replyAuthor.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="author-name">{replyAuthor}</p>
                          <p className="reply-time">{formatDate(reply.createdAt)}</p>
                        </div>
                      </div>
                      {isReplyAuthor && (
                        <button
                          className="delete-reply-button"
                          onClick={() => handleDelete(reply._id)}
                          title="Delete reply"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <p className="reply-text">{reply.content}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reply Input */}
        <form className="reply-input-form" onSubmit={handleSubmit}>
          <textarea
            className="reply-textarea"
            placeholder="Write a reply..."
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            rows={3}
            maxLength={2000}
            disabled={submitting}
          />
          <button
            type="submit"
            className="submit-reply-button"
            disabled={!newReply.trim() || submitting}
          >
            {submitting ? (
              <Loader2 className="spinner" size={18} />
            ) : (
              <Send size={18} />
            )}
            {submitting ? 'Posting...' : 'Reply'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReplyModal;