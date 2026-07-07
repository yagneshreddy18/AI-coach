import { asyncHandler } from '../utils/helpers.js';
import * as searchService from '../services/search.service.js';

export const globalSearch = asyncHandler(async (req, res) => {
  const data = await searchService.globalSearch(req.user._id, req.query.q);
  res.json({ success: true, data });
});
