import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  ArrowLeft,
  MessageSquarePlus,
  Loader2,
  MessageSquare,
} from "lucide-react";
import CreatePostModal from "./CreatePostModal/CreatePostModal";
import PostCard from "./PostCard/PostCard";
import ReplyModal from "./Reply/ReplyModal";
import {
  fetchGroupPosts,
  createGroupPost,
  deleteGroupPost,
  editGroupPost,
} from "../../services/grouppostService";

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
    <div className="min-h-screen" style={{ backgroundColor: "#fef3c7" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/my-groups")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium px-4 py-2 hover:bg-gray-50 rounded-lg"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
            >
              <MessageSquarePlus size={20} />
              New Post
            </button>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100">
              <Users size={40} color="#6366f1" strokeWidth={1.5} />
            </div>
            <div>
              <h1
                className="text-3xl font-bold text-gray-900 mb-1"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {decodeCategory(category)}
              </h1>
              <p className="text-gray-600 text-sm">
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
            <p className="text-gray-700 text-lg font-medium">
              Loading posts...
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md p-12">
            <div className="inline-block p-8 rounded-2xl mb-6 bg-gradient-to-br from-indigo-50 to-purple-50">
              <MessageSquare size={64} color="#6366f1" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              No posts yet
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Be the first to start a conversation in this group!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-lg"
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => {
              const isMyPost =
                post.userId?._id === currentUserId ||
                post.userId === currentUserId;

              return (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={currentUserId}
                  onDelete={() => handleDeletePost(post._id)}
                  onEdit={handleEditPost}
                  onViewReplies={() => setSelectedPost(post)}
                  formatDate={formatDate}
                  isMyPost={isMyPost}
                />
              );
            })}
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
