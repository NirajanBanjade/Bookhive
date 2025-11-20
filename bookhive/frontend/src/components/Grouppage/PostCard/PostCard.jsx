import React, { useState } from 'react';
import { Trash2, Link as LinkIcon, MessageCircle, Edit2, Check, X } from 'lucide-react';
import './PostCard.css';

const PostCard = ({ post, currentUserId, onDelete, onEdit, formatDate, onViewReplies }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editLinkUrl, setEditLinkUrl] = useState(post.linkUrl || '');

  const isAuthor = post.userId?._id === currentUserId || post.userId === currentUserId;
  const authorName = post.userId?.name || post.userId?.username || 'Unknown User';

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      alert('Content cannot be empty');
      return;
    }
    await onEdit(post._id, { content: editContent, linkUrl: editLinkUrl });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setEditLinkUrl(post.linkUrl || '');
    setIsEditing(false);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author-info">
          <div className="author-avatar">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="author-name">{authorName}</p>
            <p className="post-time">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        {isAuthor && (
          <div className="post-actions">
            {!isEditing ? (
              <>
                <button 
                  className="edit-post-button"
                  onClick={() => setIsEditing(true)}
                  title="Edit post"
                >
                  <Edit2 className="edit-icon" />
                </button>
                <button 
                  className="delete-post-button"
                  onClick={onDelete}
                  title="Delete post"
                >
                  <Trash2 className="delete-icon" />
                </button>
              </>
            ) : (
              <>
                <button 
                  className="save-edit-button"
                  onClick={handleSaveEdit}
                  title="Save changes"
                >
                  <Check className="check-icon" />
                </button>
                <button 
                  className="cancel-edit-button"
                  onClick={handleCancelEdit}
                  title="Cancel"
                >
                  <X className="x-icon" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="post-content">
        {isEditing ? (
          <>
            <textarea
              className="edit-textarea"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              maxLength={3000}
              rows={4}
              autoFocus
            />
            <input
              type="url"
              className="edit-link-input"
              placeholder="Link URL (optional)"
              value={editLinkUrl}
              onChange={(e) => setEditLinkUrl(e.target.value)}
            />
          </>
        ) : (
          <>
            <p className="post-text">{post.content}</p>
            {post.linkUrl && (
              <a 
                href={post.linkUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="post-link"
              >
                <LinkIcon className="link-icon" />
                {post.linkUrl}
              </a>
            )}
          </>
        )}
      </div>

      <div className="post-footer">
        <div className="post-stats">
          <span className="stat-item">
            {post.likesCount || 0} {post.likesCount === 1 ? 'like' : 'likes'}
          </span>
        </div>
        <button 
          className="reply-button"
          onClick={onViewReplies}
          title="View replies"
        >
          <MessageCircle className="reply-icon" />
          <span>{post.commentsCount || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;