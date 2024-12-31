import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNavigationState } from '../../hooks/useNavigationState';

interface BackButtonProps {
  fallbackPath?: string;
}

export const BackButton = ({ fallbackPath = '/' }: BackButtonProps) => {
  const navigate = useNavigate();
  const { previousPath } = useNavigationState();

  const handleBack = () => {
    if (previousPath) {
      navigate(previousPath);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 text-crimson-light hover:text-crimson transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Back</span>
    </button>
  );
};