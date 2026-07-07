import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import connectDB from '../config/db.js';
import DsaProblem from '../models/DsaProblem.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import AptitudeCategory from '../models/AptitudeCategory.js';

import dsaProblems from './dsaProblems.js';
import courses from './courses.js';
import aptitudeCategories from './aptitudeCategories.js';

const seed = async () => {
  try {
    // Connect using env or fallback
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/placementpilot';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing seed data
    await DsaProblem.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await AptitudeCategory.deleteMany({});
    console.log('Cleared existing seed data.');

    // Seed DSA Problems
    await DsaProblem.insertMany(dsaProblems);
    console.log(`✅ Seeded ${dsaProblems.length} DSA problems.`);

    // Seed Courses and Lessons
    let totalLessons = 0;
    for (const courseData of courses) {
      const { lessons, ...courseFields } = courseData;
      const course = await Course.create(courseFields);

      if (lessons && lessons.length > 0) {
        const lessonDocs = lessons.map((lesson) => ({
          ...lesson,
          courseId: course._id,
        }));
        await Lesson.insertMany(lessonDocs);
        totalLessons += lessonDocs.length;
      }
    }
    console.log(`✅ Seeded ${courses.length} courses with ${totalLessons} lessons.`);

    // Seed Aptitude Categories
    await AptitudeCategory.insertMany(aptitudeCategories);
    console.log(`✅ Seeded ${aptitudeCategories.length} aptitude categories.`);

    console.log('\n🎉 Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
