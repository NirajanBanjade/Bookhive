import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  ArrowLeft,
  MessageSquarePlus,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import CreatePostModal from './CreatePostModal/CreatePostModal';
import PostCard from './PostCard/PostCard';
import ReplyModal from './Reply/ReplyModal';
import { fetchGroupPosts, createGroupPost, deleteGroupPost, editGroupPost, likeGroupPost } from '../../services/grouppostService';

const GroupPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [groupInfo, setGroupInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const decodeCategory = (cat) => {
    try {
      return decodeURIComponent(cat);
    } catch {
      return cat;
    }
  };

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchGroupPosts(category);
      setPosts(data.posts || []);
      setGroupInfo({ categoryKey: data.categoryKey, groupId: data.groupId });
    } catch (err) {
      if (err.status === 403) {
        alert("You must be a member to view posts");
        navigate("/my-groups");
        return;
      }
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/user/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const userData = await res.json();
          setCurrentUserId(userData._id || userData.id);
        }
      } catch (e) {
        console.error("Error fetching user:", e);
      }
    })();
  }, []);

  useEffect(() => {
    load();
  }, [category]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setShowCreateModal(false);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deleteGroupPost(category, postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    }
  };

  const handleReplyCountChange = (postId, newCount) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, commentsCount: newCount } : post
      )
    );
  };

  const handleEditPost = async (postId, updatedData) => {
    try {
      const result = await editGroupPost(category, postId, updatedData);
      setPosts((prev) => prev.map((p) => (p._id === postId ? result.post : p)));
    } catch (err) {
      console.error("Error editing post:", err);
      alert("Failed to edit post");
    }
  };

  const handleLikePost = async (postId, isLiked) => {
    try {
      await likeGroupPost(category, postId, isLiked);
    } catch (err) {
      console.error('Error liking post:', err);
      throw err; // Re-throw to let PostCard handle the revert
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1a1a1a" }}>
      {/* Header */}
      <div
        className="border-b shadow-sm"
        style={{
          background: "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)",
          borderColor: "#4a5568",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/my-groups")}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 text-gray-900 font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <MessageSquarePlus size={20} />
              New Post
            </button>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div
              className="p-4 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
              }}
            >
              <Users size={40} color="#1a202c" strokeWidth={2} />
            </div>
            <div>
              <h1
                className="text-4xl font-bold mb-1"
                style={{
                  color: "#fbbf24",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {decodeCategory(category)}
              </h1>
              <p className="text-gray-400 text-sm">
                {posts.length} {posts.length === 1 ? "post" : "posts"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div
              className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 mb-4"
              style={{ borderTopColor: "#fbbf24" }}
            ></div>
            <p className="text-gray-400 text-lg font-medium">
              Loading posts...
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl shadow-xl p-12"
            style={{
              backgroundColor: "#2d2d2d",
              border: "1px solid #404040",
            }}
          >
            <div
              className="inline-block p-8 rounded-2xl mb-6 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
              }}
            >
              <MessageSquare size={64} color="#1a202c" strokeWidth={1.5} />
            </div>
            <h2
              className="text-3xl font-bold mb-3"
              style={{
                color: "#e5e5e5",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              No posts yet
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Be the first to start a conversation in this group!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-4 text-gray-900 font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
<div className="space-y-7 ">
  {posts.map((post) => {
    const isMyPost =
      post.userId?._id === currentUserId ||
      post.userId === currentUserId;

    return (
      <div 
        key={post._id}
        className={`post-wrapper ${isMyPost ? "my-post" : "other-post"}`}
      >
        <PostCard
          post={post}
          currentUserId={currentUserId}
          onDelete={() => handleDeletePost(post._id)}
          onEdit={handleEditPost}
          onViewReplies={() => setSelectedPost(post)}
          onLike={handleLikePost}
          formatDate={formatDate}
        />
      </div>
    );
  })}
</div>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          category={category}
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {/* Reply Modal */}
      {selectedPost && (
        <ReplyModal
          post={selectedPost}
          category={category}
          currentUserId={currentUserId}
          onClose={() => setSelectedPost(null)}
          formatDate={formatDate}
          onReplyCountChange={handleReplyCountChange}
        />
      )}
    </div>
  );
};

export default GroupPage;
