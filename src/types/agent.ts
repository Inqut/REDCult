export interface AgentConfig {
  name: string;
  username?: string;
  modelProvider: string;
  imageModelProvider?: string;
  bio: string[];
  lore: string[];
  knowledge: string[];
  messageExamples: Array<{
    user: string;
    content: { text: string };
  }[]>;
  postExamples: string[];
  topics: string[];
  style: {
    all: string[];
    chat: string[];
    post: string[];
  };
  adjectives: string[];
  clients?: any[];
  plugins?: any[];
  settings?: {
    voice?: { model?: string };
    secrets?: Record<string, any>;
  };
  templates?: {
    goalsTemplate?: string;
    factsTemplate?: string;
    messageHandlerTemplate?: string;
    continueMessageHandlerTemplate?: string;
  };
  clientConfig?: {
    discord?: Record<string, any>;
    telegram?: Record<string, any>;
  };
  twitterProfile?: {
    id?: string;
    username?: string;
    screenName?: string;
    bio?: string;
  };
}

export interface Agent {
  id: string;
  cultId: string;
  name: string;
  description: string;
  model: string;
  config: AgentConfig;
  createdAt: string;
  updatedAt: string;
}