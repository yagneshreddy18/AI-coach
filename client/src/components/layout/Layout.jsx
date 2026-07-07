import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10">
            <Sidebar collapsed={false} setCollapsed={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen hidden-on-mobile lg:block"
        style={{ minHeight: '100vh' }}
      >
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </motion.main>

      {/* Mobile main (no margin) */}
      <div className="lg:hidden min-h-screen">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
