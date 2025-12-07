import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, Trash2, Bot, Plus, MessageSquare, Menu, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/MainLayout";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import ChatMessage from "@/components/ChatMessage";
import { 
  Message, 
  Chat, 
  generateId, 
  generateChatTitle, 
  formatMessage, 
  filterAIAssistantPageReferences,
  isHinglish,
  generateSystemPrompt
} from "@/utils/aiAssistant";
import '@/styles/ai-assistant.css';

const AiAssistant = () => {
  const { toast } = useToast();
  
  // State for chat and messages
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // References
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // API configuration
  const API_URL = process.env.NODE_ENV === 'development' 
    ? "http://localhost:8081/api/assistant"
    : "/api/assistant";
  
  // Load chats from local storage
  useEffect(() => {
    const savedChats = localStorage.getItem("aiAssistantChats");
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        setChats(parsedChats);
        
        // If there are chats, set the most recent one as active
        if (parsedChats.length > 0) {
          const sortedChats = [...parsedChats].sort((a, b) => b.createdAt - a.createdAt);
          setActiveChat(sortedChats[0]);
        }
      } catch (e) {
        console.error("Failed to parse saved chats:", e);
      }
    } else {
      // Create a new chat if none exists
      handleNewChat();
    }
  }, []);

  // Save chats to local storage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("aiAssistantChats", JSON.stringify(chats));
    }
  }, [chats]);

  // Add and remove body class to disable page scrolling
  useEffect(() => {
    document.body.classList.add('ai-assistant-active');
    
    return () => {
      document.body.classList.remove('ai-assistant-active');
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  // Function to create a new chat
  const handleNewChat = () => {
    const newChat: Chat = {
      id: generateId(),
      title: "New chat",
      messages: [{
        id: generateId(),
        text: "Hi! I'm your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: Date.now()
      }],
      createdAt: Date.now()
    };
    
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat);
    setInput("");
    
    // Focus on input field
        setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };
  
  // Function to handle chat selection
  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
    setInput("");
    
    // Focus on input field
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };
  
  // Function to delete a chat
  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const filteredChats = chats.filter(chat => chat.id !== chatId);
    setChats(filteredChats);
    
    // If the deleted chat was the active one, set the first chat as active or create a new one
    if (activeChat?.id === chatId) {
      if (filteredChats.length > 0) {
        setActiveChat(filteredChats[0]);
      } else {
        handleNewChat();
      }
    }
  };
  
  // Function to clear the current chat
  const clearChat = () => {
    if (!activeChat) return;
    
    const clearedChat: Chat = {
      ...activeChat,
      messages: [{
        id: generateId(),
        text: "Hi! I'm your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: Date.now() 
      }]
    };
    
    setActiveChat(clearedChat);
    setChats(prev => prev.map(chat => 
      chat.id === activeChat.id ? clearedChat : chat
    ));
    
    toast({
      title: "Chat cleared",
      description: "Your conversation has been cleared."
    });
  };

  // Function to auto-resize textarea
  const autoResizeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setInput(textarea.value);
    
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = '45px';
    
    // Only expand if content exceeds the default height
    if (textarea.scrollHeight > 45) {
      const newHeight = Math.min(150, textarea.scrollHeight);
      textarea.style.height = `${newHeight}px`;
    }
  };

  /**
   * Function to format messages for better readability
   * - Adds line breaks between steps
   * - Ensures proper LaTeX rendering
   */
  const formatMessageForDisplay = (message: string): string => {
    // Format step headers with line breaks
    let formattedMessage = message
      // Normalize line endings
      .replace(/\r\n/g, '\n')
      // Add proper spacing around step headers
      .replace(/##\s+Step\s+\d+:/g, '\n\n$&\n')
      // Add proper spacing after step headers
      .replace(/(##\s+Step\s+\d+:[^\n]+)\n(?!\n)/g, '$1\n\n')
      // Make sure each step is properly separated
      .replace(/\n(##\s+Step)/g, '\n\n$1')
      
      // Fix common LaTeX notation issues
      .replace(/\\cdot/g, '\\times')
      .replace(/\\left\(/g, '(')
      .replace(/\\right\)/g, ')')
      
      // Make sure block LaTeX is properly formatted with whitespace
      .replace(/\$\$(.*?)\$\$/gs, (match, equation) => {
        // Clean up the equation by removing excessive whitespace
        const cleanEquation = equation.trim().replace(/\s+/g, ' ');
        return `\n\n$$\n${cleanEquation}\n$$\n\n`;
      })
      
      // Ensure inline LaTeX has proper spacing
      .replace(/(\w)(\$[^$\n]+\$)(\w)/g, '$1 $2 $3')
      
      // Format "Therefore" statements as bold and with proper spacing
      .replace(/Therefore/g, '\n\n**Therefore**')
      
      // Fix common dimensionality issues
      .replace(/(width|height|dimensions)(\s*)(=|:)(\s*)([$\\])/gi, (match, term, space1, equals, space2, math) => {
        // Capitalize the first letter of the term and add proper spacing
        return `**${term.charAt(0).toUpperCase() + term.slice(1)}**${equals} ${math}`;
      });
    
    // Clean up any triple+ newlines to double newlines
    formattedMessage = formattedMessage.replace(/\n{3,}/g, '\n\n');
    
    return formattedMessage;
  };

  /**
   * Filter out AI Assistant page references from text
   * and format the response for better readability
   */
  const filterAIAssistantPageReferences = (text: string): string => {
    // First, apply our own filtering logic instead of calling the imported function
    let filteredText = text;
    
    // Apply some basic filtering patterns
    const patterns = [
      /For detailed problem-solving, try our "?AI Assistant"? page.*/gi,
      /For (more|detailed) (assistance|help|information|details), (please )?(visit|check|use|go to|head to|try) (the |our )?"?AI Assistant"? page.*/gi,
      /You can also (try|use|visit|check) (the |our )?"?AI Assistant"? page.*/gi,
      /I recommend (using|trying|checking) (the |our )?"?AI Assistant"? page.*/gi,
      /.*AI Assistant.*page.*/gi,
    ];
    
    // Apply each pattern
    patterns.forEach(pattern => {
      filteredText = filteredText.replace(pattern, '');
    });
    
    // Then apply basic content formatting
    filteredText = formatMessageForDisplay(filteredText);
    
    // Special cleanup for LaTeX expressions
    // Format step headers properly
    filteredText = filteredText.replace(/##\s+Step\s+(\d+):/g, (match, stepNum) => {
      return `## Step ${stepNum}:`;
    });
    
    // Fix instances where LaTeX is inside markdown but not properly formatted
    if (filteredText.includes('$') || filteredText.includes('\\')) {
      // Ensure proper spacing for LaTeX blocks
      filteredText = filteredText.replace(/\$\$(.*?)\$\$/gs, (match, content) => {
        return `\n\n$$${content}$$\n\n`;
      });
      
      // Make sure inline LaTeX has proper spacing
      filteredText = filteredText.replace(/(\w)\$(\\\w+)/g, '$1 $$$2');
      filteredText = filteredText.replace(/(\\\w+)\$(\w)/g, '$1$$ $2');
      
      // Ensure proper markdown for lists with LaTeX
      filteredText = filteredText.replace(/-\s*\$\\frac/g, '- $\\frac');
    }

    // Fix common LaTeX mistakes
    filteredText = filteredText.replace(/\\cdot/g, '\\times');
    filteredText = filteredText.replace(/\\left\\{/g, '\\left\\{');
    filteredText = filteredText.replace(/\\right\\}/g, '\\right\\}');
    
    // Improve final answer presentation
    const dimensionSummaryPattern = /(dimensions|final answer|rectangle with maximum area).*(width|height)/i;
    if (dimensionSummaryPattern.test(filteredText) && !filteredText.includes('Therefore')) {
      // Try to extract dimension values
      const widthMatch = filteredText.match(/[Ww]idth\s*=\s*(?:\\frac\{([^}]+)\}\{([^}]+)\}|\\boxed\{([^}]+)\}|([0-9.\\sqrt{}/]+))/);
      const heightMatch = filteredText.match(/[Hh]eight\s*=\s*(?:\\frac\{([^}]+)\}\{([^}]+)\}|\\boxed\{([^}]+)\}|([0-9.\\sqrt{}/]+))/);
      
      if (widthMatch && heightMatch) {
        const widthValue = widthMatch[1] && widthMatch[2] ? `\\frac{${widthMatch[1]}}{${widthMatch[2]}}` : 
                           widthMatch[3] ? widthMatch[3] : widthMatch[4];
        
        const heightValue = heightMatch[1] && heightMatch[2] ? `\\frac{${heightMatch[1]}}{${heightMatch[2]}}` : 
                            heightMatch[3] ? heightMatch[3] : heightMatch[4];
        
        if (widthValue && heightValue) {
          filteredText += `\n\n**Therefore, the dimensions of the rectangle with maximum area are:**\n- Width = $${widthValue}$\n- Height = $${heightValue}$`;
        }
      }
    }
    
    return filteredText;
  };

  // Function to handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !activeChat) return;
    
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      text: input.trim(),
      isUser: true,
      timestamp: Date.now()
    };
    
    // Update chat with user message
    const updatedChat = {
      ...activeChat,
      title: activeChat.messages.length <= 1 ? generateChatTitle(input.trim()) : activeChat.title,
      messages: [...activeChat.messages, userMessage]
    };
    
    setActiveChat(updatedChat);
    setChats(prev => prev.map(chat => 
      chat.id === activeChat.id ? updatedChat : chat
    ));
    
    setInput("");
    setIsLoading(true);
    setError(null);
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = '45px';
    }
    
    try {
      // Get the last 4 messages for context
      const recentMessages = updatedChat.messages.slice(-4);
      
      // Detect if user is using Hinglish or asking for detailed info
      const userUsesHinglish = isHinglish(input.trim());
      const wantsDetailedInfo = /detail|step|explain|elaborate|clarify|breakdown/i.test(input.trim());
      
      // Prepare context for the AI Assistant
      const context = generateSystemPrompt(userUsesHinglish, wantsDetailedInfo);
      
      console.log('Sending request with context:', context);
      
      // Call our proxy endpoint
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: context },
            ...recentMessages.map(m => ({
              role: m.isUser ? "user" : "assistant",
              content: m.text
            }))
          ],
          max_tokens: wantsDetailedInfo ? 1000 : 500,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.0,
          presence_penalty: 0.0
        })
      });
      
      if (!response.ok) {
        let errorMessage = `Failed to get response: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
          console.error('Error response:', errorData);
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Received response:', data);
      
      if (!data.choices?.[0]?.message?.content) {
        console.error('Invalid response format:', data);
        throw new Error("Invalid response format from API");
      }
      
      // Get the assistant's response and filter out unnecessary references
      const botReply = filterAIAssistantPageReferences(data.choices[0].message.content.trim());
      
      // Add bot message
      const assistantMessage: Message = {
        id: generateId(),
        text: formatMessageForDisplay(botReply),
        isUser: false,
        timestamp: Date.now()
      };
      
      // Update chat with assistant's response
      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage]
      };
      
      setActiveChat(finalChat);
      setChats(prev => prev.map(chat => 
        chat.id === activeChat.id ? finalChat : chat
      ));
      
    } catch (error) {
      console.error("Error details:", error);
      
      const errorMessage = (error as Error).name === 'AbortError' 
        ? "Request timed out. Please try again."
        : (error as Error).message || "Failed to connect. Please try again.";
      
        toast({
          title: "Error",
        description: errorMessage,
          variant: "destructive",
        duration: 5000
        });
      
      // Add error message to chat
      const errorChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, {
          id: generateId(),
          text: errorMessage,
          isUser: false,
          timestamp: Date.now()
        }]
      };
      
      setActiveChat(errorChat);
      setChats(prev => prev.map(chat => 
        chat.id === activeChat.id ? errorChat : chat
      ));
      
    } finally {
      setIsLoading(false);
      // Focus on input after response
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
        scrollToBottom();
      }, 100);
    }
  };

  // Function to toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  // Close mobile sidebar when a chat is selected
  const handleSelectChatMobile = (chat: Chat) => {
    handleSelectChat(chat);
    setIsMobileSidebarOpen(false);
  };

  return (
    <MainLayout>
      <Helmet>
        <title>AI Assistant & Math Question Solver | IITM Scholar Hub</title>
        <meta name="description" content="Get instant help with math problems, programming, and academic questions. Our free AI Assistant provides step-by-step solutions for calculus, algebra, statistics and more. The perfect math question solver for students." />
        <meta name="keywords" content="free AI assistant, math question solver, free math solver, step by step math solutions, programming help, AI homework helper, IITM AI assistant, free question solver, coding assistant" />
        <meta property="og:title" content="Free AI Assistant & Math Question Solver | IITM Scholar Hub" />
        <meta property="og:description" content="Get instant help with math problems, programming, and academic questions with our free AI Assistant." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="IITM Scholar Hub" />
        <meta property="og:url" content="https://iitm-scholar-hub.vercel.app/ai-assistant" />
        <meta property="og:image" content="https://iitm-scholar-hub.vercel.app/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title" content="Free AI Assistant & Math Question Solver" />
        <meta name="twitter:description" content="Get instant solutions for math problems, programming, and academic questions." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://iitm-scholar-hub.vercel.app/og-image.svg" />
      </Helmet>
      
      <div className="fixed inset-0 pt-16 overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* Mobile sidebar overlay */}
          <AnimatePresence>
            {isMobileSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
            )}
          </AnimatePresence>
          
          {/* Left sidebar with chat history */}
          <AnimatePresence>
            {(isMobileSidebarOpen || !['xs', 'sm'].includes('md')) && (
              <motion.div
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -280, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`${
                  isMobileSidebarOpen ? "fixed left-0 top-16 bottom-0 z-50" : "hidden md:block"
                } md:relative md:w-64 lg:w-72 shrink-0 bg-[#0f172a] border-r border-gray-800 h-full no-scrollbar`}
              >
            <div className="h-full overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">AI Assistant</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMobileSidebar}
                      className="md:hidden text-white hover:bg-gray-700/50"
                    >
                      <X size={20} />
                    </Button>
              </div>
              
                  <div className="p-3">
                    <Button 
                      onClick={handleNewChat}
                      className="w-full justify-start text-sm font-normal h-10 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span>New Chat</span>
                    </Button>
                      </div>
                  
                  <div className="flex-1 overflow-auto p-3 space-y-2">
                    {chats.map(chat => (
                      <div 
                        key={chat.id} 
                        onClick={() => isMobileSidebarOpen ? handleSelectChatMobile(chat) : handleSelectChat(chat)}
                        className={`p-2 rounded-md cursor-pointer transition-all flex items-center justify-between group chat-history-item ${
                          activeChat?.id === chat.id ? 'active' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <MessageCircle className="h-4 w-4 shrink-0" />
                          <span className="truncate text-sm">{chat.title}</span>
                      </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white hover:bg-gray-600"
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
              </div>
              
              <div className="mt-auto p-4 border-t border-gray-800">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm font-normal h-10 border-dashed border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
                  onClick={clearChat}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span>Clear conversation</span>
                </Button>
              </div>
            </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main chat area */}
          <div className="flex-1 flex flex-col bg-[#0f172a] overflow-hidden relative">
            {/* Button to toggle sidebar on mobile */}
            <div className="p-2 border-b border-gray-800 flex items-center justify-between md:hidden">
                    <Button
                      variant="outline"
                size="sm"
                className="h-9 border-gray-700"
                onClick={toggleMobileSidebar}
                    >
                <Menu className="h-4 w-4 mr-2" />
                <span>Chats</span>
                    </Button>
            </div>
            
            {/* Messages area - this is the only part that should scroll */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent messages-container bg-[#0f172a] no-scrollbar">
              {activeChat?.messages.map((message, index) => (
                <motion.div
                  key={message.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div className={`flex items-start gap-3 max-w-[80%]`}>
                    {!message.isUser && (
                      <div className="w-2 rounded-full bg-gradient-to-br from-blue-500 to-violet-600"></div>
                    )}
                    
                    <ChatMessage message={message.text} isUser={message.isUser} />
                  </div>
                </motion.div>
              ))}
              
              <div ref={messagesEndRef} />
                    
                    {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 rounded-full bg-gradient-to-br from-blue-500 to-violet-600"></div>
                    <div className="px-4 py-3 rounded-2xl bg-[#1E2330] border border-gray-800">
                      <div className="flex space-x-2 typing-indicator">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                          </div>
                        </div>
                </motion.div>
                    )}
                  </div>
                  
            {/* Input area */}
            <div className="border-t border-gray-800 p-3 md:p-4 bg-[#0f172a] sticky bottom-0 z-10 shadow-sm input-container">
              <form onSubmit={handleSubmit} className="flex gap-2 items-end">
                <div className="relative flex-1">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={autoResizeTextarea}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e as unknown as React.FormEvent);
                          }
                        }}
                    placeholder="Ask anything..."
                    className="w-full bg-[#1E2330] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none pr-12 chat-input"
                        style={{
                      height: '50px',
                      maxHeight: '150px',
                      overflow: 'auto',
                          lineHeight: '1.5',
                        }}
                        disabled={isLoading}
                      />
                      <Button 
                        type="submit" 
                        size="icon"
                    className={`absolute right-2 bottom-2 h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 ${input.trim() ? 'send-button-ready' : ''}`}
                        disabled={isLoading || !input.trim()}
                      >
                    <Send size={16} />
                      </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AiAssistant;