import mongoose from 'mongoose';

const userDsaProgressSchema = new mongoose.Schema(
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
    completed: {
      type: Boolean,
      default: false,
    },
    completedDate: {
      type: Date,
      default: null,
    },
    personalNotes: {
      type: String,
      default: '',
    },
    revisionDates: [Date],
  },
  { timestamps: true }
);

// Compound index: one progress record per user per problem
userDsaProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

export default mongoose.model('UserDsaProgress', userDsaProgressSchema);
