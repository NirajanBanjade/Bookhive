// Fetch all groups the user has joined
export const getJoinedGroups = async (cursor = null, limit = 20) => {
    try {
      const url = cursor 
      ? `/api/me/groups?cursor=${cursor}&limit=${limit}`
      : `/api/me/groups?limit=${limit}`;
      const response = await fetch(url, { // ✅ Use the url variable
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch joined groups');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching joined groups:', err);
      throw err;
    }
  };
  
  // Join a group by category
  export const joinGroup = async (category) => {
    try {
      const response = await fetch(`/api/groups/${category}/join`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: category })
      });
      
      if (!response.ok) {
        throw new Error('Failed to join group');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error joining group:', err);
      throw err;
    }
  };
  
  // Leave a group by category
  export const leaveGroup = async (category) => {
    try {
      const response = await fetch(`/api/groups/${category}/leave`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to leave group');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error leaving group:', err);
      throw err;
    }
  };