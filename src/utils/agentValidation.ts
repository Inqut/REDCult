interface AgentConfig {
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

export const validateAgentConfig = (config: AgentConfig): string | null => {
  if (!config) return 'Invalid configuration file';

  // Required fields
  const requiredFields = ['name', 'modelProvider', 'bio', 'lore', 'knowledge', 'messageExamples', 'postExamples', 'topics', 'style', 'adjectives'];
  for (const field of requiredFields) {
    if (!config[field as keyof AgentConfig]) {
      return `Missing required field: ${field}`;
    }
  }

  // Validate arrays
  const arrayFields = ['bio', 'lore', 'knowledge', 'postExamples', 'topics', 'adjectives'];
  for (const field of arrayFields) {
    if (!Array.isArray(config[field as keyof AgentConfig])) {
      return `${field} must be an array`;
    }
  }

  // Validate messageExamples structure
  if (!Array.isArray(config.messageExamples)) {
    return 'messageExamples must be an array';
  }

  for (const example of config.messageExamples) {
    if (!Array.isArray(example)) {
      return 'Each messageExample must be an array of messages';
    }
    for (const message of example) {
      if (!message.user || !message.content?.text) {
        return 'Invalid message format in messageExamples';
      }
    }
  }

  // Validate style object
  if (!config.style || typeof config.style !== 'object') {
    return 'style must be an object';
  }

  const styleFields = ['all', 'chat', 'post'];
  for (const field of styleFields) {
    if (!Array.isArray(config.style[field])) {
      return `style.${field} must be an array`;
    }
  }

  return null;
};