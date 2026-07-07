import { asyncHandler } from '../utils/helpers.js';
import * as projService from '../services/project.service.js';

export const getProjects = asyncHandler(async (req, res) => {
  const data = await projService.getProjects(req.user._id);
  res.json({ success: true, data });
});

export const createProject = asyncHandler(async (req, res) => {
  const data = await projService.createProject(req.user._id, req.body);
  res.status(201).json({ success: true, data });
});

export const updateProject = asyncHandler(async (req, res) => {
  const data = await projService.updateProject(req.user._id, req.params.id, req.body);
  res.json({ success: true, data });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const data = await projService.deleteProject(req.user._id, req.params.id);
  res.json({ success: true, data });
});

export const getTasks = asyncHandler(async (req, res) => {
  const data = await projService.getTasks(req.params.projectId);
  res.json({ success: true, data });
});

export const createTask = asyncHandler(async (req, res) => {
  const data = await projService.createTask(req.params.projectId, req.body);
  res.status(201).json({ success: true, data });
});

export const toggleTask = asyncHandler(async (req, res) => {
  const data = await projService.toggleTask(req.params.taskId);
  res.json({ success: true, data });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const data = await projService.deleteTask(req.params.taskId);
  res.json({ success: true, data });
});
