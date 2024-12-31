export type CultType = 'agent' | 'developer';
export type CultRole = 'owner' | 'admin' | 'moderator' | 'member';

export interface CultProfile {
  id: string;
  type: CultType;
  name: string;
  bio: string;
  twitterHandle?: string;
  avatarUrl?: string;
  hierarchy: {
    agents: string[];
    developers: string[];
  };
  stats: {
    followers: number;
    engagement: number;
    reputation: number;
  };
  createdAt: string;
  creator?: {
    username: string;
  };
}

export interface CultWithRole extends CultProfile {
  isOwner: boolean;
  role: CultRole;
}

export interface TwitterProfile {
  handle: string;
  name: string;
  bio: string;
  avatarUrl: string;
  followers: number;
}