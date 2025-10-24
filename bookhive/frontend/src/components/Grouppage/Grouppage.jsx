import './GroupPage.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  ArrowLeft, 
  MessageSquarePlus,
  Loader2,
  MessageSquare,
  Trash2
} from 'lucide-react';
import CreatePostModal from './CreatePostModal/CreatePostModal';
import PostCard from './PostCard/PostCard';
import { fetchGroupPosts,createGroupPost,deleteGroupPost } from '../../services/grouppostService';
const GroupPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [groupInfo, setGroupInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const decodeCategory = (cat) => {
    try { return decodeURIComponent(cat); } catch { return cat; }
  };

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchGroupPosts(category);
      setPosts(data.posts || []);
      setGroupInfo({ categoryKey: data.categoryKey, groupId: data.groupId });
    } catch (err) {
      if (err.status === 403) {
        alert('You must be a member to view posts');
        navigate('/groups');
        return;
      }
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // (Optional) move this to a user service too
    (async () => {
      try {
        const res = await fetch('/api/user/me', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` }
        });
        if (res.ok) {
          const userData = await res.json();
          setCurrentUserId(userData._id || userData.id);
        }
      } catch (e) {
        console.error('Error fetching user:', e);
      }
    })();
  }, []);

  useEffect(() => { load(); }, [category]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setShowCreateModal(false);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deleteGroupPost(category, postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  return (
    <div className="group-page-container">
      {/* Header */}
      <div className="group-page-header">
        <button 
          className="back-button" 
          onClick={() => navigate('/groups')}
        >
          <ArrowLeft className="back-icon" />
        </button>

        <div className="group-header-info">
          <Users className="group-header-icon" />
          <div>
            <h1 className="group-title">{decodeCategory(category)}</h1>
            <p className="group-subtitle">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </p>
          </div>
        </div>

        <button 
          className="create-post-button"
          onClick={() => setShowCreateModal(true)}
        >
          <MessageSquarePlus className="create-icon" />
          New Post
        </button>
      </div>
    </div>
  );
};

export default GroupPage;