import React from 'react';

interface EmptyCultStateProps {
  message: string;
  actionText: string;
  onAction: () => void;
}

export const EmptyCultState = ({ message, actionText, onAction }: EmptyCultStateProps) => {
  return (
    <div className="bg-crimson-darker p-6 rounded-lg text-center">
      <p className="text-crimson-light mb-4">{message}</p>
      <button
        onClick={onAction}
        className="text-crimson hover:text-crimson-light transition-colors"
      >
        {actionText}
      </button>
    </div>
  );
};