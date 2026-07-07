import mongoose from 'mongoose';

const userLessonProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
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
  },
  { timestamps: true }
);

userLessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export default mongoose.model('UserLessonProgress', userLessonProgressSchema);
