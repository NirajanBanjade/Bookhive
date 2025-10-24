const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
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
      return data.posts || [];
    } catch (err) {
      console.error('Error fetching posts:', err);
      throw err;
    }
  };