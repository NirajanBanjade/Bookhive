// frontend/src/hooks/useNotifications.js
import { useCallback, useMemo, useState } from 'react';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../api/notifications';

export default function useNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const unreadCount = useMemo(() => items.filter(n => !n.read).length, [items]);

  const fetchPage = useCallback(async ({ page = 1, limit = 10, unread = null } = {}) => {
    try {
      setLoading(true);
      setError('');
      const data = await getNotifications({ page, limit, unread });
      const list = Array.isArray(data) ? data : (data.items || []);
      setItems(list);
      return list;
    } catch (err) {
      console.error('useNotifications.fetchPage error:', err);
      setError('Failed to load notifications');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const markOne = useCallback(async (id) => {
    try {
      await markNotificationRead(id);
      setItems(prev => prev.map(n => (n._id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n)));
    } catch (err) {
      console.error('useNotifications.markOne error:', err);
    }
  }, []);

  const markAll = useCallback(async () => {
    try {
      await markAllNotificationsRead();
      setItems(prev => prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() })));
    } catch (err) {
      console.error('useNotifications.markAll error:', err);
    }
  }, []);

  return {
    items,
    loading,
    error,
    unreadCount,
    fetchPage,
    markOne,
    markAll,
    setItems, // exposed for advanced cases
  };
}
