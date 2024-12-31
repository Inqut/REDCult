import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { isAdmin } from '../services/auth/adminService';

export const useAdmin = () => {
  const { user } = useAuth();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsUserAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const adminStatus = await isAdmin(user.id);
        setIsUserAdmin(adminStatus);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsUserAdmin(false);
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [user]);

  return { isUserAdmin, loading };
};