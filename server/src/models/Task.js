import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    taskName: {
      type: String,
      required: [true, 'Task name is required'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    completedDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

taskSchema.index({ projectId: 1 });

export default mongoose.model('Task', taskSchema);
