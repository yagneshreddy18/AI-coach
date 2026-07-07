import User from '../models/User.js';
import { generateToken } from '../utils/helpers.js';
import { ApiError } from '../middleware/errorHandler.js';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email');
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      settings: user.settings,
      streak: user.streak,
    },
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      settings: user.settings,
      streak: user.streak,
    },
    token,
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

export const updateUserProfile = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  if (updates.name) user.name = updates.name;
  if (updates.bio !== undefined) user.bio = updates.bio;
  if (updates.avatar !== undefined) user.avatar = updates.avatar;

  await user.save();
  return user;
};

export const updateUserSettings = async (userId, settings) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  Object.assign(user.settings, settings);
  await user.save();
  return user.settings;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(400, 'Current password is incorrect');

  user.password = newPassword;
  await user.save();
  return { message: 'Password updated successfully' };
};
