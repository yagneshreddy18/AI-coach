import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    resourceLink: {
      type: String,
      default: '',
    },
    estimatedTime: {
      type: Number, // in minutes
      default: 30,
    },
    orderNumber: {
      type: Number,
      required: true,
    },
    resources: {
      documentation: { type: String, default: '' },
      youtube: { type: String, default: '' },
      article: { type: String, default: '' },
      practice: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

lessonSchema.index({ courseId: 1, orderNumber: 1 });

export default mongoose.model('Lesson', lessonSchema);
