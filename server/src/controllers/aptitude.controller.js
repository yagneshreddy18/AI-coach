import { asyncHandler } from '../utils/helpers.js';
import * as aptService from '../services/aptitude.service.js';

export const getCategories = asyncHandler(async (req, res) => {
  const data = await aptService.getCategories();
  res.json({ success: true, data });
});

export const logPractice = asyncHandler(async (req, res) => {
  const data = await aptService.logPractice(req.user._id, req.body);
  res.status(201).json({ success: true, data });
});

export const getProgress = asyncHandler(async (req, res) => {
  const data = await aptService.getProgress(req.user._id);
  res.json({ success: true, data });
});

export const getWeeklyAccuracy = asyncHandler(async (req, res) => {
  const data = await aptService.getWeeklyAccuracy(req.user._id);
  res.json({ success: true, data });
});
