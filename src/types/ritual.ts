export type RitualType = 'daily' | 'weekly' | 'special';
export type RitualStatus = 'active' | 'completed' | 'failed';

export interface RitualRequirement {
  type: 'post' | 'invite' | 'engage' | 'custom';
  target: number;
  description: string;
}

export interface RitualReward {
  type: 'reputation' | 'role' | 'badge' | 'custom';
  value: any;
  description: string;
}

export interface Ritual {
  id: string;
  cultId: string;
  name: string;
  description: string;
  type: RitualType;
  requirements: RitualRequirement[];
  rewards: RitualReward[];
  startTime: string;
  endTime: string;
  minParticipants: number;
  maxParticipants?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RitualParticipant {
  ritualId: string;
  userId: string;
  status: RitualStatus;
  progress: Record<string, any>;
  joinedAt: string;
  completedAt?: string;
}