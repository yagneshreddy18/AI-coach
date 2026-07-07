import { asyncHandler } from '../utils/helpers.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.registerUser({ name, email, password });
  res.status(201).json({ success: true, data: result });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  res.json({ success: true, data: result });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user._id);
  res.json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateUserProfile(req.user._id, req.body);
  res.json({ success: true, data: user });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await authService.updateUserSettings(req.user._id, req.body);
  res.json({ success: true, data: settings });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(req.user._id, currentPassword, newPassword);
  res.json({ success: true, data: result });
});
