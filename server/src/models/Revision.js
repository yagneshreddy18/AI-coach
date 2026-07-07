import mongoose from 'mongoose';

const revisionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DsaProblem',
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedDate: {
      type: Date,
      default: null,
    },
    revisionNumber: {
      type: Number,
      required: true, // 1 = +1 day, 2 = +7 days, 3 = +30 days
    },
  },
  { timestamps: true }
);

revisionSchema.index({ userId: 1, scheduledDate: 1, completed: 1 });

export default mongoose.model('Revision', revisionSchema);
