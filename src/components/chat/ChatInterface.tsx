import React, { useState } from 'react';
import { Bot, MessageSquare } from 'lucide-react';
import { ChatWindow } from './ChatWindow';
import { ChatInput } from './ChatInput';
import { useElizaAgent } from '../../hooks/useElizaAgent';

interface ChatInterfaceProps {
  cultId?: string;
  minimized?: boolean;
  onToggle?: () => void;
}

export const ChatInterface = ({ cultId = 'global', minimized = false, onToggle }: ChatInterfaceProps) => {
  const [showChat, setShowChat] = useState(!minimized);
  const { messages, sendMessage, loading, error } = useElizaAgent(cultId);

  const handleToggle = () => {
    setShowChat(!showChat);
    onToggle?.();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!showChat ? (
        <button
          onClick={handleToggle}
          className="bg-crimson text-white p-4 rounded-full shadow-lg hover:bg-crimson-light transition-colors"
        >
          <Bot className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-crimson-darker rounded-lg shadow-xl w-96 max-h-[600px] flex flex-col">
          <div className="p-4 border-b border-crimson flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-sm text-crimson-light">Here to help</p>
              </div>
            </div>
            <button
              onClick={handleToggle}
              className="text-crimson-light hover:text-crimson transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>

          <ChatWindow messages={messages} error={error} />
          <ChatInput onSend={sendMessage} loading={loading} />
        </div>
      )}
    </div>
  );
};