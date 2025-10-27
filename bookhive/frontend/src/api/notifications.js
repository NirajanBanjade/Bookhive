// frontend/src/api/notifications.js
import http from "./http";

const BASE = "/notifications";

/** Fetch notifications for the authenticated user */
export async function getNotifications({ unread = null, page = 1, limit = 20 } = {}) {
  const params = { page, limit };
  if (unread === true) params.unread = "true";
  if (unread === false) params.unread = "false";

  const res = await http.get(BASE, { params });
  return res.data; // { items, page, total, hasMore, ... }
}

/** Mark a single notification as read */
export async function markNotificationRead(id) {
  const res = await http.patch(`${BASE}/${id}/read`);
  return res.data;
}

/** Mark all notifications as read */
export async function markAllNotificationsRead() {
  const res = await http.patch(`${BASE}/read-all`);
  return res.data;
}
