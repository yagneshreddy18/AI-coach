import { asyncHandler } from '../utils/helpers.js';
import * as notifService from '../services/notification.service.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const data = await notifService.getNotifications(req.user._id, req.query);
  res.json({ success: true, data });
});

export const markRead = asyncHandler(async (req, res) => {
  const data = await notifService.markRead(req.user._id, req.params.id);
  res.json({ success: true, data });
});

export const markAllRead = asyncHandler(async (req, res) => {
  const data = await notifService.markAllRead(req.user._id);
  res.json({ success: true, data });
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const data = await notifService.getUnreadCount(req.user._id);
  res.json({ success: true, data });
});
