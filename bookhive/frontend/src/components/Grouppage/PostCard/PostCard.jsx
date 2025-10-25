import React from 'react';
import { Trash2, Link as LinkIcon } from 'lucide-react';

const PostCard = ({ post, currentUserId, onDelete, formatDate }) => {
  const isAuthor = post.userId?._id === currentUserId || post.userId === currentUserId;
  
  const authorName = post.userId?.name || post.userId?.username || 'Unknown User';
  console.log('POST DEBUG:', {
    'post._id': post._id,
    'post.userId': post.userId,
    'post.userId._id': post.userId?._id,
    'currentUserId': currentUserId,
    'Match?': post.userId?._id === currentUserId
  });
  

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

        {isAuthor &&(
          <button 
            className="delete-post-button"
            onClick={onDelete}
            title="Delete post"
          >
            <Trash2 className="delete-icon" />
          </button>
        )}
      </div>

      <div className="post-content">
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
      </div>

      <div className="post-footer">
        <div className="post-stats">
          <span className="stat-item">
            {post.commentsCount || 0} comments
          </span>
          <span className="stat-item">
            {post.likesCount || 0} likes
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;