const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });
  
  // ============== just for GROUP POSTS ==============
  
  // Fetch all posts for a group
  export const fetchGroupPosts = async (categoryKey) => {
    try {
      const response = await fetch(`/api/groups/${categoryKey}/posts`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching posts:', err);
      throw err;
    }
  };
  export const createGroupPost = async (categoryKey, postData) => {
    try {
      const response = await fetch(`/api/groups/${categoryKey}/posts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(postData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      
      const data = await response.json();
      return data.post;
    } catch (err) {
      console.error('Error creating post:', err);
      throw err;
    }
  };
  
  // Delete a post from a group
  export const deleteGroupPost = async (categoryKey, postId) => {
    try {
      const response = await fetch(`/api/groups/${categoryKey}/posts/${postId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error deleting post:', err);
      throw err;
    }
  };

  export const editGroupPost = async (category, postId, postData) => {
    const response = await fetch(`/api/groups/${encodeURIComponent(category)}/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(postData)
    });
    if (!response.ok) throw await response.json();
    return response.json();
  };

export const likeGroupPost = async (category, postId, isLiked) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`/api/groups/${encodeURIComponent(category)}/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ isLiked }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to like post');
  }

  return response.json();
};