import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Code2, Layers, Brain, FolderKanban,
  Timer, Calendar, BarChart3, Target, Settings, ChevronLeft,
  ChevronRight, Flame, BookOpen, Search, Bell,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dsa', icon: Code2, label: 'DSA Tracker' },
  { path: '/fullstack', icon: Layers, label: 'Full Stack' },
  { path: '/aptitude', icon: Brain, label: 'Aptitude' },
  { path: '/projects', icon: FolderKanban, label: 'Projects' },
  { path: '/timer', icon: Timer, label: 'Study Timer' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/goals', icon: Target, label: 'Daily Goals' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col glass border-r border-white/5"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
          <Flame size={20} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent whitespace-nowrap">
                PlacementPilot
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-primary-500/15 text-primary-400'
                      : 'text-dark-400 hover:text-dark-200 hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-primary-500"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <item.icon size={20} className="flex-shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User + Collapse */}
      <div className="border-t border-white/5 p-3">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 px-2 py-2 mb-2"
          >
            <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-dark-400 truncate">{user?.email || ''}</p>
            </div>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-lg hover:bg-white/5 transition-colors text-dark-400 hover:text-dark-200"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
