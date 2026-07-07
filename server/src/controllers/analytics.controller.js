import { asyncHandler } from '../utils/helpers.js';
import * as analyticsService from '../services/analytics.service.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDashboardStats(req.user._id);
  res.json({ success: true, data });
});

export const getStudyAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getStudyAnalytics(req.user._id);
  res.json({ success: true, data });
});

export const getPlacementReadiness = asyncHandler(async (req, res) => {
  const data = await analyticsService.getPlacementReadiness(req.user._id);
  res.json({ success: true, data });
});
