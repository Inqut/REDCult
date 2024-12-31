import React from 'react';
import { useLocation } from 'react-router-dom';
import { NavHeader } from './NavHeader';
import { MainNav } from './MainNav';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useNavigation } from '../../hooks/useNavigation';

export const DashboardNav = () => {
  const { isSidebarOpen, toggleSidebar } = useNavigation();
  const location = useLocation();

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex lg:flex-col">
        <NavHeader />
        <div className="flex flex-1 min-h-0">
          <Sidebar isOpen={isSidebarOpen} />
          <MainNav />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNav isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      </div>
    </>
  );
};