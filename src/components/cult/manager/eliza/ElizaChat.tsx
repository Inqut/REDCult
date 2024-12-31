import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, AlertCircle } from 'lucide-react';
import { useElizaAgent } from '../../../../hooks/useElizaAgent';
import { ChatMessage } from './ChatMessage';

export const ElizaChat = ({ cultId }: { cultId: string }) => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, loading, error } = useElizaAgent(cultId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  return (
    <div className="flex flex-col h-[600px] bg-crimson-darker rounded-lg">
      <div className="p-4 border-b border-crimson flex items-center gap-2">
        <Bot className="w-6 h-6" />
        <div>
          <h3 className="text-lg font-semibold">Chat with Eliza</h3>
          <p className="text-sm text-crimson-light">Your AI Cult Assistant</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="p-4 bg-red-500 bg-opacity-10 border-t border-red-500 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t border-crimson">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-crimson-darkest border border-crimson p-2 rounded-lg focus:outline-none focus:border-crimson-light"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-crimson text-white p-2 rounded-lg hover:bg-crimson-light transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            {loading && <span>...</span>}
          </button>
        </div>
      </form>
    </div>
  );
};