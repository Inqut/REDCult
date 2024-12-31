import React from 'react';
import { Bell } from 'lucide-react';

export const NotificationBadge = () => {
  const count = 3; // This would come from a notifications store/context

  return (
    <button className="relative p-2 text-crimson-light hover:text-crimson transition-colors">
      <Bell className="w-6 h-6" />
      {count > 0 && (
        <span className="absolute top-0 right-0 w-5 h-5 bg-crimson text-white text-xs flex items-center justify-center rounded-full">
          {count}
        </span>
      )}
    </button>
  );
};