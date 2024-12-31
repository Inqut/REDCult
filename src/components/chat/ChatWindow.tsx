import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { AlertCircle } from 'lucide-react';
import type { Message } from '../../types/chat';

interface ChatWindowProps {
  messages: Message[];
  error: string | null;
}

export const ChatWindow = ({ messages, error }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
      
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500 bg-opacity-10 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};