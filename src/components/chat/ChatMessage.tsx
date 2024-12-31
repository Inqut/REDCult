import React from 'react';
import { Bot, User } from 'lucide-react';
import type { Message } from '../../types/chat';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAgent = message.role === 'agent';

  return (
    <div className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg flex gap-3 ${
          isAgent
            ? 'bg-crimson-dark text-crimson-light'
            : 'bg-crimson text-white'
        }`}
      >
        {isAgent && <Bot className="w-5 h-5 flex-shrink-0" />}
        <div className="break-words whitespace-pre-wrap">{message.content}</div>
        {!isAgent && <User className="w-5 h-5 flex-shrink-0" />}
      </div>
    </div>
  );
};