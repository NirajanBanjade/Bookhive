// frontend/src/hooks/useNotifications.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/notifications";

/**
 * useNotifications
 * - Fetches notifications on mount
 * - Optional polling (default 20s)
 * - Exposes handlers that match NotificationsDropdown props
 */
export default function useNotifications({ pollMs = 20000 } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mounted = useRef(true);
  const timer = useRef(null);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items]
  );

  const fetchPage = useCallback(
    async ({ page = 1, limit = 20, unread = null } = {}) => {
      try {
        setLoading(true);
        setError("");
        const data = await getNotifications({ page, limit, unread });
        const list = Array.isArray(data) ? data : data.items || [];
        if (mounted.current) setItems(list);
        return list;
      } catch (err) {
        console.error("notifications.fetchPage", err);
        if (mounted.current) setError("Failed to load notifications");
        return [];
      } finally {
        if (mounted.current) setLoading(false);
      }
    },
    []
  );

  const onMarkOne = useCallback(async (id) => {
    try {
      await markNotificationRead(id);
      if (!mounted.current) return;
      setItems((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n
        )
      );
    } catch (err) {
      console.error("notifications.markOne", err);
    }
  }, []);

  const onMarkAll = useCallback(async () => {
    try {
      await markAllNotificationsRead();
      if (!mounted.current) return;
      setItems((prev) =>
        prev.map((n) => ({ ...n, read: true, readAt: new Date().toISOString() }))
      );
    } catch (err) {
      console.error("notifications.markAll", err);
    }
  }, []);

  // initial fetch + polling
  useEffect(() => {
    mounted.current = true;
    fetchPage({});
    if (pollMs > 0) {
      timer.current = setInterval(() => fetchPage({}), pollMs);
    }
    return () => {
      mounted.current = false;
      if (timer.current) clearInterval(timer.current);
    };
  }, [fetchPage, pollMs]);

  return {
    items,
    loading,
    error,
    unreadCount,
    fetchPage,
    onMarkOne,     // matches NotificationsDropdown prop
    onMarkAll,     // matches NotificationsDropdown prop
    setItems,      // exposed if you need manual tweaks
  };
}
