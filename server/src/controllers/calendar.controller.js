import { asyncHandler } from '../utils/helpers.js';
import * as calendarService from '../services/calendar.service.js';

export const getCalendarData = asyncHandler(async (req, res) => {
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const data = await calendarService.getCalendarData(req.user._id, month, year);
  res.json({ success: true, data });
});
