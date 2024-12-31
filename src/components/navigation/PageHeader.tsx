import React from 'react';
import { BackButton } from './BackButton';
import { Breadcrumbs } from './Breadcrumbs';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  showBreadcrumbs?: boolean;
  actions?: React.ReactNode;
}

export const PageHeader = ({ 
  title, 
  showBack = true, 
  showBreadcrumbs = true,
  actions 
}: PageHeaderProps) => {
  return (
    <div className="border-b border-crimson mb-6">
      {showBreadcrumbs && <Breadcrumbs />}
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && <BackButton />}
          <h1 className="text-2xl font-bold text-crimson-light">{title}</h1>
        </div>
        {actions && (
          <div className="flex items-center gap-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};