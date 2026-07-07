import mongoose from 'mongoose';

const aptitudeProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AptitudeCategory',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 0,
    },
    correct: {
      type: Number,
      required: true,
      min: 0,
    },
    wrong: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

aptitudeProgressSchema.index({ userId: 1, categoryId: 1, date: -1 });

export default mongoose.model('AptitudeProgress', aptitudeProgressSchema);
