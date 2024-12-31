import { useState, useEffect } from 'react';

export const useNavigation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [window.location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return {
    isSidebarOpen,
    toggleSidebar,
  };
};