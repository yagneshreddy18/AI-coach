import DailyGoal from '../models/DailyGoal.js';
import Revision from '../models/Revision.js';
import Project from '../models/Project.js';

export const getCalendarData = async (userId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const [goals, revisions, projects] = await Promise.all([
    DailyGoal.find({ userId, date: { $gte: startDate, $lte: endDate } }).lean(),
    Revision.find({ userId, scheduledDate: { $gte: startDate, $lte: endDate } })
      .populate('problemId', 'title')
      .lean(),
    Project.find({ userId, deadline: { $gte: startDate, $lte: endDate } }).lean(),
  ]);

  // Build calendar events
  const events = [];

  goals.forEach((goal) => {
    events.push({
      date: goal.date,
      type: goal.isCompleted ? 'goal-completed' : 'goal-missed',
      title: goal.isCompleted ? 'Daily Goals Completed ✅' : 'Daily Goals Incomplete',
      data: goal,
    });
  });

  revisions.forEach((rev) => {
    events.push({
      date: rev.scheduledDate,
      type: rev.completed ? 'revision-completed' : 'revision-pending',
      title: `Revision: ${rev.problemId?.title || 'Problem'}`,
      data: rev,
    });
  });

  projects.forEach((proj) => {
    events.push({
      date: proj.deadline,
      type: 'deadline',
      title: `Deadline: ${proj.title}`,
      data: proj,
    });
  });

  return events;
};
