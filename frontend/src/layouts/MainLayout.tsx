import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import { useTheme } from '../hooks';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} print:bg-white print:text-black`}>
      <div className="print:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden print:overflow-visible">
        <div className="print:hidden">
          <Navbar 
            darkMode={isDarkMode} 
            onToggleTheme={toggleTheme} 
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />
        </div>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 print:p-0 print:overflow-visible">
          <div className="mx-auto max-w-7xl print:max-w-none print:w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
