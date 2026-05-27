import React, { useRef, useEffect } from 'react';
import type { Message } from '../types/mathscape';
import { Sparkles, User, Send, Lightbulb, Compass, RotateCcw } from 'lucide-react';
import { MathText } from './MathText';

interface AICoachPanelProps {
  messages: Message[];
  isAITyping: boolean;
  onSendMessage: (text: string) => void;
  inputMessage: string;
  setInputMessage: (text: string) => void;
  onTriggerHint: () => void;
  onResetScenario: () => void;
}

export const AICoachPanel: React.FC<AICoachPanelProps> = ({
  messages,
  isAITyping,
  onSendMessage,
  inputMessage,
  setInputMessage,
  onTriggerHint,
  onResetScenario
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAITyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage.trim());
    setInputMessage('');
  };

  return (
    <div className="chat-container">
      
      {/* Scrollable messages log */}
      <div className="chat-messages-area">
        {messages.map((m) => {
          const isAI = m.sender === 'ai';
          const rowClass = isAI ? 'ai' : 'student';
          
          return (
            <div key={m.id} className={`message-row ${rowClass}`}>
              
              {/* Avatar circle */}
              <div className="chat-avatar">
                {isAI ? <Sparkles size={14} /> : <User size={14} />}
              </div>

              {/* Message contents */}
              <div className="message-bubble-wrapper">
                <div className="message-meta">
                  <span>{isAI ? "SOCRATES COACH" : "STUDENT"}</span>
                  <span>{m.timestamp}</span>
                </div>
                
                <div className="message-bubble">
                  <MathText text={m.text} />
                </div>

                {/* Socratic quick reply chips */}
                {isAI && m.chips && m.chips.length > 0 && (
                  <div className="chips-container">
                    {m.chips.map((chipText, cidx) => (
                      <button
                        key={cidx}
                        onClick={() => {
                          const cleanedText = chipText.replace(/^[💡📈🔄🔍]\s*/, '');
                          setInputMessage(cleanedText);
                        }}
                        className="chip"
                      >
                        {chipText}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          );
        })}

        {/* Typing thinking indicator */}
        {isAITyping && (
          <div className="message-row ai">
            <div className="chat-avatar">
              <Sparkles size={14} />
            </div>
            <div className="message-bubble-wrapper">
              <div className="message-meta">
                <span>SOCRATES IS THINKING</span>
              </div>
              <div className="typing-indicator">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Action Controls Block */}
      <div className="chat-input-area">
        {/* Helper Socratic buttons */}
        <div className="helpers-row">
          <div className="helpers-left">
            <button 
              onClick={onTriggerHint}
              className="btn-helper hint"
              title="Get Socratic Hint"
            >
              <Lightbulb size={12} />
              Need Hint
            </button>
            
            <button 
              onClick={() => onSendMessage("Am I on the right track?")}
              className="btn-helper check"
            >
              <Compass size={12} />
              Check Steps
            </button>
          </div>

          <button onClick={onResetScenario} className="btn-reset-chat">
            <RotateCcw size={10} />
            Reset Chat
          </button>
        </div>

        {/* Input Bar Form */}
        <form onSubmit={handleSubmit} className="chat-form">
          <input 
            type="text" 
            placeholder="Type your explanation or question... (e.g. y = 2x + 10)"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isAITyping}
            className="chat-input"
          />
          <button 
            type="submit"
            disabled={!inputMessage.trim() || isAITyping}
            className="btn-primary btn-send"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

    </div>
  );
};
