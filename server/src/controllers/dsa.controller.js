import { asyncHandler } from '../utils/helpers.js';
import * as dsaService from '../services/dsa.service.js';

export const getAllProblems = asyncHandler(async (req, res) => {
  const data = await dsaService.getAllProblems(req.user._id, req.query);
  res.json({ success: true, data });
});

export const getTopics = asyncHandler(async (req, res) => {
  const data = await dsaService.getTopics();
  res.json({ success: true, data });
});

export const getProgress = asyncHandler(async (req, res) => {
  const data = await dsaService.getProgress(req.user._id);
  res.json({ success: true, data });
});

export const markComplete = asyncHandler(async (req, res) => {
  const data = await dsaService.markComplete(req.user._id, req.params.problemId);
  res.json({ success: true, data });
});

export const undoComplete = asyncHandler(async (req, res) => {
  const data = await dsaService.undoComplete(req.user._id, req.params.problemId);
  res.json({ success: true, data });
});

export const updateNotes = asyncHandler(async (req, res) => {
  const data = await dsaService.updateNotes(req.user._id, req.params.problemId, req.body.notes);
  res.json({ success: true, data });
});

export const getNextUnsolved = asyncHandler(async (req, res) => {
  const count = parseInt(req.query.count) || 5;
  const data = await dsaService.getNextUnsolved(req.user._id, count);
  res.json({ success: true, data });
});
