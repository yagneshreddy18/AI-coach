import mongoose from 'mongoose';

const aptitudeCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'Brain',
    },
    color: {
      type: String,
      default: '#8b5cf6',
    },
  },
  { timestamps: true }
);

export default mongoose.model('AptitudeCategory', aptitudeCategorySchema);
