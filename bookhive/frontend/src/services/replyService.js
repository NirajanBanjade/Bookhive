const API_BASE = '/api';

export const fetchReplies = async (category, postId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/groups/${encodeURIComponent(category)}/posts/${postId}/replies`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch replies');
  return res.json();
};

export const createReply = async (category, postId, content) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/groups/${encodeURIComponent(category)}/posts/${postId}/replies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content })
  });
  if (!res.ok) throw new Error('Failed to create reply');
  return res.json();
};

export const deleteReply = async (category, postId, replyId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/groups/${encodeURIComponent(category)}/posts/${postId}/replies/${replyId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete reply');
  return res.json();
};