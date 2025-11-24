import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Link as LinkIcon, MessageCircle, Edit2, Check, X, Heart, MoreVertical } from 'lucide-react';
import './PostCard.css';

const PostCard = ({ post, currentUserId, onDelete, onEdit, formatDate, onViewReplies, onLike }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editLinkUrl, setEditLinkUrl] = useState(post.linkUrl || '');
  const [isLiked, setIsLiked] = useState(post.isLikedByUser || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const isAuthor = post.userId?._id === currentUserId || post.userId === currentUserId;
  const authorName = post.userId?.name || post.userId?.username || 'Unknown User';

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleLike = async () => {
    const newLikedState = !isLiked;
    const newCount = newLikedState ? likesCount + 1 : likesCount - 1;
    
    setIsLiked(newLikedState);
    setLikesCount(newCount);
    
    try {
      await onLike(post._id, newLikedState);
    } catch (err) {
      // Revert on error
      setIsLiked(!newLikedState);
      setLikesCount(likesCount);
    }
  };

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

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDelete = () => {
    setShowMenu(false);
    onDelete();
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
          <div className="post-actions" ref={menuRef}>
            {!isEditing ? (
              <>
                <button 
                  className="menu-button"
                  onClick={() => setShowMenu(!showMenu)}
                  title="More options"
                >
                  <MoreVertical className="menu-icon" />
                </button>
                
                {showMenu && (
                  <div className="dropdown-menu">
                    <button 
                      className="menu-item"
                      onClick={handleEdit}
                    >
                      <Edit2 className="menu-item-icon" />
                      Edit post
                    </button>
                    <button 
                      className="menu-item delete"
                      onClick={handleDelete}
                    >
                      <Trash2 className="menu-item-icon" />
                      Delete post
                    </button>
                  </div>
                )}
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
        <div className="post-interactions">
          <button 
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`heart-icon ${isLiked ? 'filled' : ''}`} />
            <span className="interaction-count">{likesCount}</span>
          </button>
          
          <button 
            className="reply-button"
            onClick={onViewReplies}
            title="View replies"
          >
            <MessageCircle className="reply-icon" />
            <span className="interaction-count">{post.commentsCount || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;