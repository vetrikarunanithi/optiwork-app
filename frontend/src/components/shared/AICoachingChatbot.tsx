import { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Bot, Send, X, Sparkles, TrendingUp, Award, Lightbulb, Zap } from 'lucide-react';
import { cn } from '../ui/utils';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  category?: 'performance' | 'tip' | 'skill' | 'schedule' | 'general';
}

interface AICoachingChatbotProps {
  userName?: string;
  userRole?: 'employee' | 'supervisor' | 'admin';
  onClose?: () => void;
}

export function AICoachingChatbot({ userName, userRole = 'employee', onClose }: AICoachingChatbotProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hey ${userName || 'there'}! 👋\n\nI'm your AI Performance Coach. I analyze your work patterns and help you work smarter.\n\nWhat can I help you with?`,
      timestamp: new Date(),
      suggestions: ['📊 My Performance', '⚡ Productivity Tips', '🎓 Skill Growth'],
      category: 'general'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 100);
      }
    }
  }, [messages]);

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'performance':
        return <TrendingUp className="w-4 h-4" />;
      case 'tip':
        return <Lightbulb className="w-4 h-4" />;
      case 'skill':
        return <Award className="w-4 h-4" />;
      case 'schedule':
        return <Zap className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    let content = '';
    let suggestions: string[] = [];
    let category: Message['category'] = 'general';

    if (lowerMessage.includes('performance') || lowerMessage.includes('stats') || lowerMessage.includes('📊')) {
      content = "📊 Your Performance Summary\n\n✅ Completion Rate: 95%\n⚡ Efficiency: +15% above avg\n🎯 Quality Score: 98/100\n⏱️ On-Time Delivery: 100%\n\nYou're in the top 10% of your team!\nKeep up the excellent work! 🌟";
      suggestions = ['💡 How to improve?', '📈 View trends', '🏆 Team ranking'];
      category = 'performance';
    } else if (lowerMessage.includes('tip') || lowerMessage.includes('productivity') || lowerMessage.includes('⚡') || lowerMessage.includes('improve')) {
      content = "💡 Smart Productivity Tip\n\nBased on your work patterns:\n\n🔹 Peak Performance: 10 AM - 12 PM\n🔹 Recommendation: Schedule complex tasks in this window\n🔹 Impact: ~20% faster completion\n\nTry batching similar tasks together for better focus! 🎯";
      suggestions = ['🎯 Optimize my schedule', '📅 More tips', '⏰ Set reminder'];
      category = 'tip';
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('training') || lowerMessage.includes('🎓') || lowerMessage.includes('learn')) {
      content = "🎓 Personalized Skill Recommendations\n\nBased on your profile and demand:\n\n🔸 Advanced CNC Machining\n   Duration: 3 weeks | Demand: High\n   💰 Potential: +15% pay increase\n\n🔸 TIG Welding Certification\n   Duration: 2 weeks | Industry standard\n\n🔸 Quality Control Level 2\n   Duration: 4 weeks | Career growth\n\nReady to level up? 🚀";
      suggestions = ['📚 Create learning path', '🎯 Available courses', '👤 Talk to supervisor'];
      category = 'skill';
    } else if (lowerMessage.includes('schedule') || lowerMessage.includes('tasks') || lowerMessage.includes('today') || lowerMessage.includes('optim')) {
      content = "📅 Smart Schedule Optimization\n\n🔴 High Priority: 3 tasks\n   Best start: 10:00 AM\n\n🟡 Medium Priority: 2 tasks\n   Afternoon recommended\n\n⏱️ Estimated finish: 4:30 PM\n💪 Current workload: 75% (Optimal)\n\nYour productivity peaks at 10 AM - tackle complex work then! 🎯";
      suggestions = ['🔄 Reorder tasks', '📋 View details', '⚙️ Adjust priorities'];
      category = 'schedule';
    } else if (lowerMessage.includes('compare') || lowerMessage.includes('team') || lowerMessage.includes('ranking') || lowerMessage.includes('🏆')) {
      content = "🏆 Team Performance Comparison\n\nYou vs Team Average:\n\n📊 Completion: 95% vs 82% (+13%)\n⚡ Speed: 115% vs 100% (+15%)\n🎯 Quality: 98% vs 91% (+7%)\n\n🥈 You rank #2 out of 15 team members!\n\nTop strength: Consistency & Quality 💎";
      suggestions = ['🌟 Top performers secrets', '📈 My growth trend', '🎯 Set new goals'];
      category = 'performance';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('what can')) {
      content = "🤖 I can help you with:\n\n📊 Performance Analytics\n   View stats, trends & insights\n\n⚡ Task Optimization\n   Smart scheduling & efficiency\n\n🎓 Skill Development\n   Personalized training paths\n\n🏆 Goal Tracking\n   Progress & achievements\n\n📈 Benchmarking\n   Compare with top performers\n\nWhat would you like to explore?";
      suggestions = ['📊 My stats', '⚡ Optimize work', '🎓 Learn skills'];
      category = 'general';
    } else {
      content = "I can help you with that! 💬\n\nHere's what I specialize in:\n\n📊 Performance insights & trends\n⚡ Task optimization & scheduling\n🎓 Skill development recommendations\n💡 Productivity tips & tricks\n\nWhat interests you most?";
      suggestions = ['📊 Show performance', '⚡ Get tips', '🎓 Recommend skills'];
      category = 'general';
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content,
      timestamp: new Date(),
      suggestions,
      category
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: suggestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(suggestion);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-2xl shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 z-50 transition-all hover:scale-110 active:scale-95 group"
      >
        <div className="relative flex items-center justify-center">
          <Bot className="w-7 h-7 text-white" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </div>
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[440px] max-w-[calc(100vw-3rem)] h-[680px] max-h-[calc(100vh-3rem)] z-50 shadow-2xl border-0 overflow-hidden animate-scale-in flex flex-col">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-6 flex flex-col justify-between">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        {/* Header Content */}
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">AI Coach</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-white/90">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
              className="text-white hover:bg-white/20 h-8 w-8 rounded-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 h-8 w-8 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative flex gap-4 text-white/90 text-xs">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>95% Accuracy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-900/30 overflow-hidden">
        <ScrollArea ref={scrollRef} className="h-full">
          <div className="p-4 pb-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3 animate-fade-in',
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Avatar */}
              {message.type === 'bot' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div className={cn(
                'flex flex-col gap-2 flex-1 min-w-0',
                message.type === 'user' ? 'items-end' : 'items-start'
              )}>
                {/* Message Bubble */}
                <div className="relative">
                  {/* Category Icon Badge */}
                  {message.type === 'bot' && message.category && message.category !== 'general' && (
                    <div className="absolute -left-2 -top-2 w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg z-10">
                      {getCategoryIcon(message.category)}
                    </div>
                  )}

                  <div
                    className={cn(
                      'rounded-2xl px-4 py-3 shadow-md whitespace-pre-line break-words',
                      message.type === 'bot'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                        : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                    )}
                  >
                    <div className="text-[13px] leading-relaxed">{message.content}</div>
                  </div>
                </div>

                {/* Quick Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        disabled={isTyping}
                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-500 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <span className="text-[10px] text-slate-500 dark:text-slate-400 px-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* User Avatar */}
              {message.type === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center flex-shrink-0 shadow-md text-white font-semibold">
                  {userName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 flex items-center gap-1.5 shadow-md">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="flex gap-2 mb-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask me anything..."
            className="flex-1 h-11 rounded-xl border-2 focus:border-blue-500 transition-colors"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="h-11 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <Sparkles className="w-3 h-3" />
          <span>AI-powered insights from your performance data</span>
        </div>
      </div>
    </Card>
  );
}
