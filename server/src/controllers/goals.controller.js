import { asyncHandler } from '../utils/helpers.js';
import * as goalsService from '../services/goals.service.js';

export const getTodayGoal = asyncHandler(async (req, res) => {
  const data = await goalsService.getTodayGoal(req.user._id);
  res.json({ success: true, data });
});

export const updateGoalProgress = asyncHandler(async (req, res) => {
  const data = await goalsService.updateGoalProgress(req.user._id, req.body);
  res.json({ success: true, data });
});

export const getGoalHistory = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const data = await goalsService.getGoalHistory(req.user._id, days);
  res.json({ success: true, data });
});

export const updateTargets = asyncHandler(async (req, res) => {
  const data = await goalsService.updateTargets(req.user._id, req.body);
  res.json({ success: true, data });
});
