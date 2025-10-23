import React from 'react';

/** UI-only row for a single notification */
export default function NotificationItem({ item, onMarkRead }) {
  return (
    <li className={`p-3 text-sm flex items-start gap-2 ${!item.read ? 'bg-blue-50' : ''}`}>
      {!item.read ? <span className="mt-1 w-2 h-2 bg-blue-500 rounded-full" /> : <span className="mt-1 w-2 h-2" />}
      <div className="flex-1">
        <div className="text-gray-800">{item.message}</div>
        <div className="text-[11px] text-gray-500 mt-1">
          {item.entityType === 'BOOK' && item.metadata?.bookTitle ? item.metadata.bookTitle : item.entityId}
        </div>
      </div>
      {!item.read && (
        <button onClick={() => onMarkRead(item._id)} className="text-xs text-primary hover:underline">
          Mark read
        </button>
      )}
    </li>
  );
}
