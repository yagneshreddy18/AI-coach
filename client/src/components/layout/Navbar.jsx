import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, LogOut, User, Menu, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { searchAPI } from '../../services/api';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults(null); return; }
    try {
      const res = await searchAPI.globalSearch(q);
      setSearchResults(res.data);
      setShowSearch(true);
    } catch { /* ignore */ }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left: Menu + Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-dark-400"
        >
          <Menu size={20} />
        </button>

        <div ref={searchRef} className="relative hidden sm:block">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
            <input
              type="text"
              placeholder="Search problems, lessons, projects..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchResults && setShowSearch(true)}
              className="input-base pl-9 w-[280px] lg:w-[360px] text-sm"
            />
          </div>

          {/* Search Dropdown */}
          <AnimatePresence>
            {showSearch && searchResults && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full mt-2 left-0 w-full glass-card p-3 max-h-[400px] overflow-y-auto z-50"
              >
                {searchResults.problems?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-dark-400 mb-1 uppercase">DSA Problems</p>
                    {searchResults.problems.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => { navigate('/dsa'); setShowSearch(false); setSearchQuery(''); }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm"
                      >
                        {p.title}
                        <span className={`ml-2 badge badge-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.lessons?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-dark-400 mb-1 uppercase">Lessons</p>
                    {searchResults.lessons.map((l) => (
                      <button
                        key={l._id}
                        onClick={() => { navigate('/fullstack'); setShowSearch(false); setSearchQuery(''); }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm"
                      >
                        {l.title}
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.projects?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-dark-400 mb-1 uppercase">Projects</p>
                    {searchResults.projects.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => { navigate('/projects'); setShowSearch(false); setSearchQuery(''); }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm"
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                )}
                {!searchResults.problems?.length && !searchResults.lessons?.length && !searchResults.projects?.length && (
                  <p className="text-sm text-dark-400 text-center py-4">No results found</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-lg hover:bg-white/5 transition-colors text-dark-400 hover:text-dark-200"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="p-2.5 rounded-lg hover:bg-white/5 transition-colors text-dark-400 hover:text-dark-200 relative"
        >
          <Bell size={18} />
        </button>

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-48 glass-card py-2 z-50"
              >
                <button
                  onClick={() => { navigate('/settings'); setShowProfile(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5 text-left"
                >
                  <User size={16} /> Profile
                </button>
                <button
                  onClick={() => { navigate('/settings'); setShowProfile(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5 text-left"
                >
                  <Settings size={16} /> Settings
                </button>
                <hr className="my-1 border-white/5" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5 text-left text-danger-400"
                >
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
