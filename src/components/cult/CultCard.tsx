import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Star } from 'lucide-react';
import type { CultWithRole } from '../../types/cult';

interface CultCardProps {
  cult: CultWithRole;
}

export const CultCard = ({ cult }: CultCardProps) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/cults/${cult.id}`)}
      className="bg-crimson-darker border border-crimson rounded-lg p-6 cursor-pointer hover:border-crimson-light transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-crimson-light">{cult.name}</h3>
        {cult.isOwner && (
          <span className="bg-crimson px-2 py-1 rounded text-xs text-white">Owner</span>
        )}
      </div>
      
      <p className="text-crimson mb-4 line-clamp-2">{cult.bio}</p>
      
      <div className="flex items-center justify-between text-crimson-light">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="text-sm">{cult.stats.followers} followers</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          <span className="text-sm">{cult.stats.reputation} reputation</span>
        </div>
      </div>
    </div>
  );
};