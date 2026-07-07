import { asyncHandler } from '../utils/helpers.js';
import * as timerService from '../services/timer.service.js';

export const saveSession = asyncHandler(async (req, res) => {
  const data = await timerService.saveSession(req.user._id, req.body);
  res.status(201).json({ success: true, data });
});

export const getTodayTime = asyncHandler(async (req, res) => {
  const data = await timerService.getTodayTime(req.user._id);
  res.json({ success: true, data });
});

export const getWeeklyTime = asyncHandler(async (req, res) => {
  const data = await timerService.getWeeklyTime(req.user._id);
  res.json({ success: true, data });
});

export const getMonthlyTime = asyncHandler(async (req, res) => {
  const data = await timerService.getMonthlyTime(req.user._id);
  res.json({ success: true, data });
});

export const getRecentSessions = asyncHandler(async (req, res) => {
  const data = await timerService.getRecentSessions(req.user._id);
  res.json({ success: true, data });
});
