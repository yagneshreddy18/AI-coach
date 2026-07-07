import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';

// Layouts
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import DSATracker from './pages/dsa/DSATracker';
import FullStack from './pages/fullstack/FullStack';
import Aptitude from './pages/aptitude/Aptitude';
import Projects from './pages/projects/Projects';
import StudyTimer from './pages/timer/StudyTimer';
import Calendar from './pages/calendar/Calendar';
import Analytics from './pages/analytics/Analytics';
import DailyGoals from './pages/goals/DailyGoals';
import Settings from './pages/settings/Settings';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected App Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="dsa" element={<DSATracker />} />
                <Route path="fullstack" element={<FullStack />} />
                <Route path="aptitude" element={<Aptitude />} />
                <Route path="projects" element={<Projects />} />
                <Route path="timer" element={<StudyTimer />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="goals" element={<DailyGoals />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
