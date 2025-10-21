// Fetch all groups the user has joined
export const getJoinedGroups = async () => {
    try {
      const response = await fetch('/api/groups/joined', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch joined groups');
      }
      
      const data = await response.json();
      return data.groups || [];
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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