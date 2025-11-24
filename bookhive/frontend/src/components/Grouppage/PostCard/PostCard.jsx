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

  const isAuthor =
    post.userId?._id === currentUserId || post.userId === currentUserId;
  const authorName =
    post.userId?.name || post.userId?.username || "Unknown User";

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
      alert("Content cannot be empty");
      return;
    }
    await onEdit(post._id, { content: editContent, linkUrl: editLinkUrl });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setEditLinkUrl(post.linkUrl || "");
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
    <div
      className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      style={{
        background: isAuthor
          ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
          : "linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)",
        border: isAuthor ? "2px solid #fbbf24" : "2px solid #d6d3d1",
      }}
    >
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              color: "#ffffff",
            }}
          >
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p
              className="font-bold"
              style={{
                fontFamily: "'Poppins', sans-serif",
                color: "#1a202c",
              }}
            >
              {authorName}
            </p>
            <p className="text-sm" style={{ color: "#78716c" }}>
              {formatDate(post.createdAt)}
            </p>
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
                
                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="dropdown-menu">
                    <button className="menu-item" onClick={handleEdit}>
                      <Edit2 className="menu-item-icon" />
                      Edit
                    </button>
                    <button className="menu-item delete" onClick={handleDelete}>
                      <Trash2 className="menu-item-icon" />
                      Delete
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
                  style={{
                    backgroundColor: "#dcfce7",
                    color: "#16a34a",
                  }}
                  title="Save changes"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
                  style={{
                    backgroundColor: "#f3f4f6",
                    color: "#4b5563",
                  }}
                  title="Cancel"
                >
                  <X size={18} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 resize-none transition-all shadow-sm"
              style={{
                backgroundColor: "#ffffff",
                border: "2px solid #d6d3d1",
                fontFamily: "'Inter', sans-serif",
                color: "#1a202c",
              }}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              maxLength={3000}
              rows={4}
              autoFocus
            />
            <input
              type="url"
              className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm"
              style={{
                backgroundColor: "#ffffff",
                border: "2px solid #d6d3d1",
                fontFamily: "'Inter', sans-serif",
                color: "#1a202c",
              }}
              placeholder="Link URL (optional)"
              value={editLinkUrl}
              onChange={(e) => setEditLinkUrl(e.target.value)}
            />
          </div>
        ) : (
          <>
            <p
              className="leading-relaxed mb-3"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "15px",
                color: "#1a202c",
              }}
            >
              {post.content}
            </p>
            {post.linkUrl && (
              
               <a href={post.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                  color: "#1e40af",
                  border: "1px solid #93c5fd",
                }}
              >
                <LinkIcon size={16} />
                <span className="truncate max-w-md">{post.linkUrl}</span>
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