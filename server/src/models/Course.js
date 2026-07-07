import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'BookOpen',
    },
    orderNumber: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      default: '#6366f1',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
