// frontend/src/api/notifications.js
import axios from 'axios'; // use your configured instance if you have one

const BASE = '/api/notifications';

/** Get notifications for the logged-in user */
export async function getNotifications({ unread = null, page = 1, limit = 20 } = {}) {
  const params = { page, limit };
  if (unread === true) params.unread = 'true';
  if (unread === false) params.unread = 'false';
  const res = await axios.get(BASE, { params, withCredentials: true });
  return res.data; // expect { items, page, limit, total, ... }
}

/** Mark a single notification as read */
export async function markNotificationRead(id) {
  const res = await axios.patch(`${BASE}/${id}/read`, null, { withCredentials: true });
  return res.data;
}

/** Mark all notifications as read */
export async function markAllNotificationsRead() {
  const res = await axios.patch(`${BASE}/read-all`, null, { withCredentials: true });
  return res.data;
}
