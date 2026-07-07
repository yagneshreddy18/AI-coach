const dsaProblems = [
  // Arrays
  { title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/two-sum/', orderNumber: 1, resources: { youtube: 'https://www.youtube.com/watch?v=KLlXCFG5TnA' } },
  { title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'Easy', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', orderNumber: 2 },
  { title: 'Contains Duplicate', topic: 'Arrays', difficulty: 'Easy', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/contains-duplicate/', orderNumber: 3 },
  { title: 'Maximum Subarray', topic: 'Arrays', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/maximum-subarray/', orderNumber: 4 },
  { title: 'Product of Array Except Self', topic: 'Arrays', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/product-of-array-except-self/', orderNumber: 5 },
  { title: 'Container With Most Water', topic: 'Arrays', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/container-with-most-water/', orderNumber: 6 },
  { title: 'Trapping Rain Water', topic: 'Arrays', difficulty: 'Hard', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/trapping-rain-water/', orderNumber: 7 },

  // Strings
  { title: 'Valid Anagram', topic: 'Strings', difficulty: 'Easy', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/valid-anagram/', orderNumber: 8 },
  { title: 'Valid Palindrome', topic: 'Strings', difficulty: 'Easy', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/valid-palindrome/', orderNumber: 9 },
  { title: 'Longest Substring Without Repeating Characters', topic: 'Strings', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', orderNumber: 10 },
  { title: 'Longest Palindromic Substring', topic: 'Strings', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/longest-palindromic-substring/', orderNumber: 11 },
  { title: 'Group Anagrams', topic: 'Strings', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/group-anagrams/', orderNumber: 12 },

  // Linked List
  { title: 'Reverse Linked List', topic: 'Linked List', difficulty: 'Easy', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/reverse-linked-list/', orderNumber: 13 },
  { title: 'Merge Two Sorted Lists', topic: 'Linked List', difficulty: 'Easy', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/merge-two-sorted-lists/', orderNumber: 14 },
  { title: 'Linked List Cycle', topic: 'Linked List', difficulty: 'Easy', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/linked-list-cycle/', orderNumber: 15 },
  { title: 'Remove Nth Node From End of List', topic: 'Linked List', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', orderNumber: 16 },

  // Stack
  { title: 'Valid Parentheses', topic: 'Stack', difficulty: 'Easy', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/valid-parentheses/', orderNumber: 17 },
  { title: 'Min Stack', topic: 'Stack', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/min-stack/', orderNumber: 18 },
  { title: 'Daily Temperatures', topic: 'Stack', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/daily-temperatures/', orderNumber: 19 },

  // Trees
  { title: 'Maximum Depth of Binary Tree', topic: 'Trees', difficulty: 'Easy', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', orderNumber: 20 },
  { title: 'Invert Binary Tree', topic: 'Trees', difficulty: 'Easy', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/invert-binary-tree/', orderNumber: 21 },
  { title: 'Same Tree', topic: 'Trees', difficulty: 'Easy', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/same-tree/', orderNumber: 22 },
  { title: 'Binary Tree Level Order Traversal', topic: 'Trees', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', orderNumber: 23 },
  { title: 'Validate Binary Search Tree', topic: 'Trees', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/validate-binary-search-tree/', orderNumber: 24 },
  { title: 'Lowest Common Ancestor of a BST', topic: 'Trees', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', orderNumber: 25 },

  // Binary Search
  { title: 'Binary Search', topic: 'Binary Search', difficulty: 'Easy', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/binary-search/', orderNumber: 26 },
  { title: 'Search in Rotated Sorted Array', topic: 'Binary Search', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', orderNumber: 27 },
  { title: 'Find Minimum in Rotated Sorted Array', topic: 'Binary Search', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', orderNumber: 28 },

  // Graphs
  { title: 'Number of Islands', topic: 'Graphs', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/number-of-islands/', orderNumber: 29 },
  { title: 'Clone Graph', topic: 'Graphs', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/clone-graph/', orderNumber: 30 },
  { title: 'Course Schedule', topic: 'Graphs', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/course-schedule/', orderNumber: 31 },
  { title: 'Pacific Atlantic Water Flow', topic: 'Graphs', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', orderNumber: 32 },

  // Dynamic Programming
  { title: 'Climbing Stairs', topic: 'Dynamic Programming', difficulty: 'Easy', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/climbing-stairs/', orderNumber: 33 },
  { title: 'House Robber', topic: 'Dynamic Programming', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/house-robber/', orderNumber: 34 },
  { title: 'Coin Change', topic: 'Dynamic Programming', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/coin-change/', orderNumber: 35 },
  { title: 'Longest Increasing Subsequence', topic: 'Dynamic Programming', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/longest-increasing-subsequence/', orderNumber: 36 },
  { title: 'Word Break', topic: 'Dynamic Programming', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/word-break/', orderNumber: 37 },
  { title: 'Longest Common Subsequence', topic: 'Dynamic Programming', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/longest-common-subsequence/', orderNumber: 38 },

  // Greedy
  { title: 'Jump Game', topic: 'Greedy', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/jump-game/', orderNumber: 39 },
  { title: 'Gas Station', topic: 'Greedy', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/gas-station/', orderNumber: 40 },

  // Backtracking
  { title: 'Subsets', topic: 'Backtracking', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/subsets/', orderNumber: 41 },
  { title: 'Combination Sum', topic: 'Backtracking', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/combination-sum/', orderNumber: 42 },
  { title: 'Permutations', topic: 'Backtracking', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/permutations/', orderNumber: 43 },
  { title: 'N-Queens', topic: 'Backtracking', difficulty: 'Hard', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/n-queens/', orderNumber: 44 },

  // Heap
  { title: 'Kth Largest Element in an Array', topic: 'Heap', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', orderNumber: 45 },
  { title: 'Top K Frequent Elements', topic: 'Heap', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/top-k-frequent-elements/', orderNumber: 46 },
  { title: 'Find Median from Data Stream', topic: 'Heap', difficulty: 'Hard', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/find-median-from-data-stream/', orderNumber: 47 },

  // Two Pointers
  { title: '3Sum', topic: 'Two Pointers', difficulty: 'Medium', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/3sum/', orderNumber: 48 },
  { title: 'Move Zeroes', topic: 'Two Pointers', difficulty: 'Easy', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/move-zeroes/', orderNumber: 49 },

  // Sliding Window
  { title: 'Minimum Window Substring', topic: 'Sliding Window', difficulty: 'Hard', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/minimum-window-substring/', orderNumber: 50 },
];

export default dsaProblems;
