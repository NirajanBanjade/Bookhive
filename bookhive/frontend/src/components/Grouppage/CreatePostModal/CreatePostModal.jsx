import React, { useState } from 'react';
import { X, Loader2, Send } from 'lucide-react';

const CreatePostModal = ({ category, onClose, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!content.trim()) {
        alert('Please enter some content');
        return;
      }
  
      try {
        setSubmitting(true);
        const res = await fetch(`/api/groups/${category}/posts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // FIXED: Changed from 'jwt_token' to 'token'
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: content.trim(),
            linkUrl: linkUrl.trim() || undefined
          })
        });
  
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Failed to create post');
        }
  
        const data = await res.json();
        onPostCreated(data.post);
        setContent('');
        setLinkUrl('');
        onClose(); // ADDED: Close modal after successful post
      } catch (err) {
        console.error('Error creating post:', err);
        alert(err.message || 'Failed to create post');
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create Post</h2>
          <button className="modal-close" onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label className="form-label">What's on your mind?</label>
            <textarea
              className="form-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={6}
              maxLength={3000}
              required
            />
            <div className="char-count">
              {content.length} / 3000
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Link (optional)</label>
            <input
              type="url"
              className="form-input"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={submitting || !content.trim()}
            >
              {submitting ? (
                <>
                  <Loader2 className="button-spinner" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="send-icon" />
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