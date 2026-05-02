const NotificationList = ({ notifications = [] }) => {
  if (!notifications.length) {
    return <div className="glass-card p-5 text-sm text-slate-400">No notifications available.</div>;
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div key={notification._id} className="glass-card p-4">
          <p className="text-sm text-white">{notification.message}</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">{notification.type}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
