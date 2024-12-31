export interface CultProfile {
  id: string;
  userId: string;
  type: 'agent' | 'developer';
  name: string;
  moniker: string;
  description: string;
  twitterHandle?: string;
  avatarUrl?: string;
  followers: number;
  createdAt: string;
}

export interface InitiationQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}