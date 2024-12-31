import { Ritual, RitualStatus } from '../types/ritual';

export const isRitualActive = (ritual: Ritual): boolean => {
  const now = new Date();
  const startTime = new Date(ritual.startTime);
  const endTime = new Date(ritual.endTime);
  return now >= startTime && now <= endTime;
};

export const canJoinRitual = (ritual: Ritual): boolean => {
  if (!isRitualActive(ritual)) return false;
  
  if (!ritual.maxParticipants) return true;
  
  const currentParticipants = ritual.ritual_participants?.length || 0;
  return currentParticipants < ritual.maxParticipants;
};

export const getRitualProgress = (ritual: Ritual): number => {
  const total = ritual.requirements.length;
  if (total === 0) return 0;
  
  const completed = ritual.ritual_participants?.reduce((acc, participant) => {
    const progress = participant.progress || {};
    return acc + Object.values(progress).filter(p => p.completed).length;
  }, 0) || 0;
  
  return (completed / total) * 100;
};