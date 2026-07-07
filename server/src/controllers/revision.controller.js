import { asyncHandler } from '../utils/helpers.js';
import * as revService from '../services/revision.service.js';

export const getTodayRevisions = asyncHandler(async (req, res) => {
  const data = await revService.getTodayRevisions(req.user._id);
  res.json({ success: true, data });
});

export const getUpcomingRevisions = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const data = await revService.getUpcomingRevisions(req.user._id, days);
  res.json({ success: true, data });
});

export const markRevisionComplete = asyncHandler(async (req, res) => {
  const data = await revService.markRevisionComplete(req.user._id, req.params.id);
  res.json({ success: true, data });
});

export const getAllRevisions = asyncHandler(async (req, res) => {
  const data = await revService.getAllRevisions(req.user._id);
  res.json({ success: true, data });
});
