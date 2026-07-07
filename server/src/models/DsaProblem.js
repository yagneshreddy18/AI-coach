import mongoose from 'mongoose';

const dsaProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      enum: [
        'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue',
        'Trees', 'Binary Search', 'Graphs', 'Dynamic Programming',
        'Greedy', 'Backtracking', 'Heap', 'Hashing', 'Sorting',
        'Recursion', 'Bit Manipulation', 'Math', 'Sliding Window',
        'Two Pointers', 'Trie',
      ],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
    },
    platform: {
      type: String,
      default: 'LeetCode',
      enum: ['LeetCode', 'GeeksForGeeks', 'HackerRank', 'CodeForces', 'InterviewBit', 'Other'],
    },
    problemLink: {
      type: String,
      default: '',
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

dsaProblemSchema.index({ topic: 1, difficulty: 1 });
dsaProblemSchema.index({ title: 'text' });

export default mongoose.model('DsaProblem', dsaProblemSchema);
