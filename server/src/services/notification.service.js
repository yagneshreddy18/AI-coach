import Notification from '../models/Notification.js';

export const getNotifications = async (userId, { unreadOnly = false, limit = 20 }) => {
  const query = { userId };
  if (unreadOnly) query.read = false;
  return Notification.find(query).sort({ createdAt: -1 }).limit(limit).lean();
};

export const markRead = async (userId, notificationId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  );
};

export const markAllRead = async (userId) => {
  await Notification.updateMany({ userId, read: false }, { read: true });
  return { message: 'All notifications marked as read' };
};

export const createNotification = async (userId, { title, message, type, actionLink }) => {
  return Notification.create({ userId, title, message, type, actionLink });
};

export const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({ userId, read: false });
  return { count };
};

// Future: FCM push notification sender
export const sendPushNotification = async (userId, payload) => {
  // TODO: Implement FCM push when Firebase is configured
  // For now, create an in-app notification
  return createNotification(userId, payload);
};
