import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: Number, // in seconds
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: ['DSA', 'Full Stack', 'Aptitude', 'Projects', 'Other'],
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

studySessionSchema.index({ userId: 1, date: -1 });

export default mongoose.model('StudySession', studySessionSchema);
