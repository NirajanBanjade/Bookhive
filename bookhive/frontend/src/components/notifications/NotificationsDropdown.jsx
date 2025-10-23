import React from 'react';
import NotificationItem from './NotificationItem';

/** UI-only dropdown; no fetching here */
export default function NotificationsDropdown({
  open,
  loading,
  error,
  items = [],
  unreadCount = 0,
  onMarkAll,
  onMarkOne,
}) {
  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <span className="text-sm font-semibold">Notifications</span>
        <button
          onClick={onMarkAll}
          className="text-xs text-primary hover:underline disabled:text-gray-400"
          disabled={items.length === 0 || unreadCount === 0}
        >
          Mark all as read
        </button>
      </div>

      {loading && <div className="p-3 text-sm text-gray-500">Loading…</div>}
      {error && <div className="p-3 text-sm text-red-600">{error}</div>}

      {!loading && !error && (
        <ul className="max-h-80 overflow-auto divide-y">
          {items.length === 0 ? (
            <li className="p-3 text-sm text-gray-500">No notifications</li>
          ) : (
            items.map((n) => <NotificationItem key={n._id} item={n} onMarkRead={onMarkOne} />)
          )}
        </ul>
      )}
    </div>
  );
}
