import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Heart } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your mental health companion. I'm here to provide support, guidance, and a listening ear. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: inputMessage
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. Remember, if you're in crisis, please reach out to a mental health professional or crisis hotline immediately.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container py-8 animate-fade-in">
      <div className="card flex flex-col" style={{height: '600px'}}>
        {/* Header */}
        <div className="p-6" style={{borderBottom: '1px solid var(--border-color)'}}>
          <div className="flex items-center gap-3">
            <div className="rounded-full flex items-center justify-center" style={{width: '2.5rem', height: '2.5rem', backgroundColor: 'var(--primary-100)'}}>
              <Bot style={{width: '1.5rem', height: '1.5rem'}} className="text-green" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Mental Health Companion
              </h2>
              <p className="text-sm text-secondary">
                Always here to listen and support you
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-6 flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'text-white'
                    : 'text-primary'
                }`}
                style={{
                  maxWidth: '24rem',
                  backgroundColor: message.sender === 'user' 
                    ? 'var(--primary-600)' 
                    : 'var(--bg-secondary)'
                }}
              >
                <div className="flex items-start gap-2">
                  {message.sender === 'bot' && (
                    <Bot style={{width: '1rem', height: '1rem', marginTop: '0.25rem'}} className="text-green" />
                  )}
                  {message.sender === 'user' && (
                    <User style={{width: '1rem', height: '1rem', marginTop: '0.25rem', color: 'white'}} />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' 
                        ? 'opacity-75' 
                        : 'text-muted'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-lg" style={{maxWidth: '24rem', backgroundColor: 'var(--bg-secondary)'}}>
                <div className="flex items-center gap-2">
                  <Bot style={{width: '1rem', height: '1rem'}} className="text-green" />
                  <div className="flex gap-1">
                    <div className="animate-bounce rounded-full" style={{width: '0.5rem', height: '0.5rem', backgroundColor: 'var(--primary-600)'}}></div>
                    <div className="animate-bounce rounded-full" style={{width: '0.5rem', height: '0.5rem', backgroundColor: 'var(--primary-600)', animationDelay: '0.1s'}}></div>
                    <div className="animate-bounce rounded-full" style={{width: '0.5rem', height: '0.5rem', backgroundColor: 'var(--primary-600)', animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6" style={{borderTop: '1px solid var(--border-color)'}}>
          <form onSubmit={handleSendMessage} className="flex gap-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Share what's on your mind..."
              className="flex-1 input"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="btn btn-primary flex items-center gap-2"
            >
              <Send style={{width: '1rem', height: '1rem'}} />
              <span>Send</span>
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-muted">
              This AI companion provides general support and is not a replacement for professional mental health care.
              If you're in crisis, please contact a mental health professional or emergency services.
            </p>
          </div>
        </div>
      </div>

      {/* Support Resources */}
      <div className="mt-8 card p-6 animate-gradient">
        <div className="text-center">
          <Heart style={{width: '2rem', height: '2rem', color: 'white'}} className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2" style={{color: 'white'}}>
            Crisis Resources
          </h3>
          <p className="mb-4" style={{color: 'rgba(255, 255, 255, 0.9)'}}>
            If you're experiencing a mental health crisis, please reach out for immediate help:
          </p>
          <div className="text-sm flex flex-col gap-1" style={{color: 'rgba(255, 255, 255, 0.9)'}}>
            <p><strong>National Suicide Prevention Lifeline:</strong> 988</p>
            <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
            <p><strong>Emergency Services:</strong> 911</p>
          </div>
        </div>
      </div>
    </div>
  );
}