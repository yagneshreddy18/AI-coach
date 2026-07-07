import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ChevronLeft, CheckCircle2, Circle, StickyNote, Video, ExternalLink, BookOpen, Clock } from 'lucide-react';
import { fullstackAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const FullStack = () => {
  const { addToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessonsData, setLessonsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [activeNotesId, setActiveNotesId] = useState(null);
  const [currentNotes, setCurrentNotes] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fullstackAPI.getCourses();
      setCourses(res.data);
    } catch (err) {
      addToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSelectCourse = async (courseId) => {
    try {
      setLessonsLoading(true);
      const res = await fullstackAPI.getCourseLessons(courseId);
      setLessonsData(res.data);
      setSelectedCourse(courseId);
    } catch (err) {
      addToast('Failed to load course lessons', 'error');
    } finally {
      setLessonsLoading(false);
    }
  };

  const handleToggleLesson = async (lessonId) => {
    try {
      await fullstackAPI.toggleLesson(lessonId);
      addToast('Lesson status updated!', 'success');
      // Refresh lessons data
      const res = await fullstackAPI.getCourseLessons(selectedCourse);
      setLessonsData(res.data);
      // Refresh course list to update percentages
      const coursesRes = await fullstackAPI.getCourses();
      setCourses(coursesRes.data);
    } catch (err) {
      addToast('Failed to toggle lesson', 'error');
    }
  };

  const handleOpenNotes = (lesson) => {
    setActiveNotesId(lesson._id);
    setCurrentNotes(lesson.userProgress?.personalNotes || '');
  };

  const handleSaveNotes = async (lessonId) => {
    try {
      await fullstackAPI.updateNotes(lessonId, currentNotes);
      addToast('Lesson notes saved!', 'success');
      setActiveNotesId(null);
      // Refresh lessons data
      const res = await fullstackAPI.getCourseLessons(selectedCourse);
      setLessonsData(res.data);
    } catch (err) {
      addToast('Failed to save notes', 'error');
    }
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'text-success-400 bg-success-500/10';
      case 'intermediate': return 'text-warning-400 bg-warning-500/10';
      case 'advanced': return 'text-danger-400 bg-danger-500/10';
      default: return 'text-primary-400 bg-primary-500/10';
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <AnimatePresence mode="wait">
        {!selectedCourse ? (
          // Course Deck
          <motion.div
            key="courses"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-1 flex items-center gap-2">
                <Layers className="text-primary-400" /> Full Stack Developer Path
              </h1>
              <p className="text-dark-400">Step-by-step developer learning syllabus. Complete core web concepts, system designs, and projects.</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-56 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    onClick={() => handleSelectCourse(course._id)}
                    className="glass-card p-6 flex flex-col justify-between group cursor-pointer border border-white/5 hover:border-primary-500/30 transition-all duration-300"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </span>
                        <span className="text-xs text-dark-500 font-semibold">{course.orderNumber}. Lesson Block</span>
                      </div>
                      <h3 className="text-lg font-bold group-hover:text-primary-400 transition-colors mb-2">{course.title}</h3>
                      <p className="text-dark-400 text-sm line-clamp-3 mb-4">{course.description}</p>
                    </div>
                    <div className="space-y-2 mt-auto pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-dark-400">{course.completedLessons}/{course.totalLessons} completed</span>
                        <span className="font-semibold text-primary-400">{course.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          // Lesson List
          <motion.div
            key="lessons"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header / Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <button
                onClick={() => setSelectedCourse(null)}
                className="btn btn-secondary flex items-center gap-2 self-start"
              >
                <ChevronLeft size={16} /> Back to Courses
              </button>
              {lessonsData?.course && (
                <div className="text-right sm:text-left">
                  <h2 className="text-xl font-bold">{lessonsData.course.title}</h2>
                  <p className="text-xs text-dark-400">Progress: {lessonsData.completedLessons} of {lessonsData.totalLessons} lessons ({lessonsData.progress}%)</p>
                </div>
              )}
            </div>

            {lessonsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {lessonsData?.lessons.map((lesson) => {
                  const isCompleted = lesson.userProgress?.completed;
                  return (
                    <div
                      key={lesson._id}
                      className={`glass-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/5 hover:border-primary-500/20 transition-all duration-300 ${
                        isCompleted ? 'bg-white/[0.01] border-white/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleToggleLesson(lesson._id)}
                          className={`mt-1 transition-colors flex-shrink-0 ${
                            isCompleted ? 'text-success-400' : 'text-dark-600 hover:text-dark-400'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                        </button>
                        <div>
                          <h4 className={`text-base font-semibold ${isCompleted ? 'line-through text-dark-500' : ''}`}>
                            {lesson.title}
                          </h4>
                          <p className="text-dark-400 text-sm mt-1">{lesson.description}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-dark-500">
                            <span className="flex items-center gap-1">
                              <Clock size={13} /> {lesson.duration || 15} mins
                            </span>
                            {lesson.videoLink && (
                              <a
                                href={lesson.videoLink}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 text-primary-400 hover:text-primary-300"
                              >
                                <Video size={13} /> Video Resource
                              </a>
                            )}
                            {lesson.articleLink && (
                              <a
                                href={lesson.articleLink}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 text-accent-400 hover:text-accent-300"
                              >
                                <ExternalLink size={13} /> Documentation
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => handleOpenNotes(lesson)}
                          className={`btn ${
                            lesson.userProgress?.personalNotes
                              ? 'btn-primary !p-2'
                              : 'btn-secondary !p-2'
                          }`}
                          title="Write notes"
                        >
                          <StickyNote size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Dialog */}
      <AnimatePresence>
        {activeNotesId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="modal-content p-6"
            >
              <h3 className="text-lg font-bold mb-2">Lesson Notes</h3>
              <p className="text-xs text-dark-400 mb-4">Write down key take-aways, definitions, or commands from this lesson.</p>
              <textarea
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                placeholder="Key syntax, setup configurations, structural definitions..."
                className="input-base h-40 resize-none mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveNotesId(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveNotes(activeNotesId)}
                  className="btn btn-primary"
                >
                  Save Notes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FullStack;
