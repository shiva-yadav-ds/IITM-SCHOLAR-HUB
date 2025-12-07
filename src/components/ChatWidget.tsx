import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, MinusIcon, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import ChatMessage from '@/components/ChatMessage';
import { useLocation } from 'react-router-dom';
import '@/styles/ai-assistant.css';

// Message type definition
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

// Generate a unique ID for messages
const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

// ChatWidget component
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const location = useLocation();
  
  // Initial welcome message based on the current page
  useEffect(() => {
    const isResumePage = location.pathname.includes('resume');
    const welcomeMessage = isResumePage 
      ? "Hi! I can help you create a professional resume. What kind of assistance do you need?" 
      : "Hello! I'm your IITM Scholar Hub assistant. How can I help you today?";
    
    setMessages([{
      id: generateId(),
      text: welcomeMessage,
      isUser: false,
      timestamp: Date.now()
    }]);
  }, [location.pathname]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
      scrollToBottom();
  }, [messages]);

  // Focus input when opening chat
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      if (isMinimized) {
        setIsMinimized(false);
      } else {
        setIsOpen(false);
      }
    }
  };
  
  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      text: input.trim(),
      isUser: true,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Determine which API endpoint to use based on current page
      const isResumePage = location.pathname.includes('resume');
      
      // For development, use direct API call
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : '';
      const endpoint = `${baseUrl}/chat-widget`;
      
      console.log('Sending chat request to:', endpoint);
      
      // Add context about current page
      const contextMessage = isResumePage 
        ? "The user is currently on the Resume Generator page and needs help with creating or improving their resume."
        : `The user is currently on the ${location.pathname === '/' ? 'Home' : location.pathname.replace('/', '')} page of the IITM Scholar Hub.`;
      
      // Get last few messages for context (max 3)
      const recentMessages = [
        ...messages.slice(-3),
        userMessage
      ];
      
      // Call API endpoint
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: contextMessage },
            ...recentMessages.map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.text
            }))
          ]
        })
      });
      
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      // Add bot response
      const botResponse = data.response || data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process your request.";
      
      setMessages(prev => [...prev, { 
        id: generateId(),
        text: botResponse,
        isUser: false,
        timestamp: Date.now()
      }]);
      
    } catch (error) {
      console.error('Error:', error);
        toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get a response. Please try again.',
        variant: 'destructive',
      });
      
      // Add error message as a bot message
      setMessages(prev => [...prev, { 
        id: generateId(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.", 
        isUser: false,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <>
      {/* Chat toggle button */}
        <Button 
        className="fixed right-6 bottom-6 h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg flex justify-center items-center"
        onClick={toggleChat}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px',
              width: isMinimized ? '300px' : '350px'
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-6 bottom-20 bg-[#0f172a] text-white rounded-lg shadow-xl border border-gray-800 overflow-hidden z-50 flex flex-col"
          >
            {/* Chat header */}
            <div className="bg-[#1e293b] px-4 py-3 flex justify-between items-center border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Bot size={18} />
                <h3 className="text-sm font-medium">IITM Scholar Hub Assistant</h3>
              </div>
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-gray-400 hover:text-white"
                  onClick={minimizeChat}
                >
                  <MinusIcon size={16} />
                </Button>
            <Button 
              variant="ghost" 
              size="icon" 
                  className="h-7 w-7 text-gray-400 hover:text-white ml-1"
                  onClick={toggleChat}
            >
                  <X size={16} />
            </Button>
          </div>
            </div>
            
            {/* Chat messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 messages-container">
                  {messages.map((message) => (
                    <div key={message.id} className="mb-3">
                      <ChatMessage message={message.text} isUser={message.isUser} />
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <div className="flex space-x-1 typing-indicator">
                        <div className="typing-dot" style={{ animationDelay: '-0.32s' }}></div>
                        <div className="typing-dot" style={{ animationDelay: '-0.16s' }}></div>
                        <div className="typing-dot" style={{ animationDelay: '0s' }}></div>
                      </div>
                    </div>
                  )}
                  
                <div ref={messagesEndRef} />
                </div>
                
                {/* Chat input */}
                <form onSubmit={handleSubmit} className="p-3 border-t border-gray-800">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-[#1e293b] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center disabled:opacity-50"
                      disabled={isLoading || !input.trim()}
                    >
                      <Send size={14} />
                    </Button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
      )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget; 