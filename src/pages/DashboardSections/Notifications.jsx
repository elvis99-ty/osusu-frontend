// src/pages/DashboardSections/Notifications.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";

const MOCK_NOTIFICATIONS = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  type: i % 3 === 0 ? "transaction" : i % 3 === 1 ? "group" : "system",
  title:
    i % 3 === 0
      ? "Contribution Successful"
      : i % 3 === 1
      ? "New Group Created"
      : "System Update",
  message:
    i % 3 === 0
      ? `You contributed ₦${(i + 1) * 1000} to a group.`
      : i % 3 === 1
      ? `You successfully created group #${i + 1}.`
      : `Report #${i + 1} has been logged successfully.`,
  timestamp: `2025-09-${(i % 30) + 1} 10:${(i % 59)
    .toString()
    .padStart(2, "0")} AM`,
  read: i % 2 === 0, // half read, half unread
}));

const Notifications = ({ onUnreadChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const containerRef = useRef(null);

  useEffect(() => {
    setNotifications(MOCK_NOTIFICATIONS);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Notify Dashboard whenever unread count changes
  useEffect(() => {
    if (onUnreadChange) {
      onUnreadChange(unreadCount);
    }
  }, [unreadCount, onUnreadChange]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      // Load more notifications when reaching the bottom
      setVisibleCount((prev) => Math.min(prev + 10, notifications.length));
    }
  }, [notifications.length]);

  return (
    <div className="notifications-page">
      <h2 className="page-title">Notifications</h2>

      <div
        className="table-container"
        ref={containerRef}
        style={{ maxHeight: "400px", overflowY: "auto" }}
        onScroll={handleScroll}
      >
        <table className="styled-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Message</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {notifications.slice(0, visibleCount).map((notif) => (
              <tr
                key={notif.id}
                className={!notif.read ? "unread-row cursor-pointer" : "cursor-pointer"}
                onClick={() => markAsRead(notif.id)}
              >
                <td>
                  {notif.type === "transaction"
                    ? "💰 Transaction"
                    : notif.type === "group"
                    ? "👥 Group"
                    : "📢 System"}
                </td>
                <td>{notif.title}</td>
                <td>{notif.message}</td>
                <td>{notif.timestamp}</td>
                <td>
                  {!notif.read ? (
                    <span className="status-unread">Unread</span>
                  ) : (
                    <span className="status-read">Read</span>
                  )}
                </td>
              </tr>
            ))}
            {visibleCount < notifications.length && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                  Loading more...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Notifications;
