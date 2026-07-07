import mongoose from 'mongoose';

const dailyGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    dsaTarget: { type: Number, default: 5 },
    dsaCompleted: { type: Number, default: 0 },
    fullstackTarget: { type: Number, default: 2 },
    fullstackCompleted: { type: Number, default: 0 },
    aptitudeTarget: { type: Number, default: 20 },
    aptitudeCompleted: { type: Number, default: 0 },
    projectTarget: { type: Number, default: 3 },
    projectCompleted: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

dailyGoalSchema.index({ userId: 1, date: -1 }, { unique: true });

export default mongoose.model('DailyGoal', dailyGoalSchema);
