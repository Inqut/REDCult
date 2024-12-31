export interface Message {
  role: 'user' | 'agent';
  content: string;
}

export interface ChatConfig {
  cultId?: string;
  agentId?: string;
  context?: string[];
}