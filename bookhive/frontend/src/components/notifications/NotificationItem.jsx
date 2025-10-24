// frontend/src/components/notifications/NotificationItem.jsx
import React, { useMemo, useState } from "react";

/** UI-only row for a single notification */
export default function NotificationItem({ item, onMarkRead, onCloseDropdown }) {
  const [pending, setPending] = useState(false);

  const timeAgo = useMemo(() => {
    if (!item?.createdAt) return "";
    const d = new Date(item.createdAt);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }, [item?.createdAt]);

  const handleMark = async () => {
    if (item.read || pending) return;
    try {
      setPending(true);
      await onMarkRead(item._id);
      if (onCloseDropdown) onCloseDropdown(); // close dropdown
    } finally {
      setPending(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleMark();
    }
  };

  const isUnread = !item.read;
  const hint =
    item.entityType === "BOOK" && item.metadata?.bookTitle
      ? item.metadata.bookTitle
      : item.entityId ?? "";

  return (
    <li
      className={`p-3 text-sm flex items-start gap-2 cursor-pointer ${
        isUnread ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"
      }`}
      onClick={handleMark}
      onKeyDown={onKey}
      role="button"
      tabIndex={0}
      aria-pressed={!isUnread}
      aria-label={`Notification: ${item.message}`}
    >
      {isUnread ? (
        <span className="mt-1 w-2 h-2 bg-blue-500 rounded-full shrink-0" />
      ) : (
        <span className="mt-1 w-2 h-2 shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        <div className="text-gray-800 break-words">{item.message}</div>
        <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
          {hint && <span className="truncate max-w-[14rem]">{hint}</span>}
          {timeAgo && <span>• {timeAgo}</span>}
        </div>
      </div>

      {isUnread && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleMark();
          }}
          disabled={pending}
          className="text-xs text-primary hover:underline disabled:opacity-50"
        >
          {pending ? "Marking…" : "Mark read"}
        </button>
      )}
    </li>
  );
}
