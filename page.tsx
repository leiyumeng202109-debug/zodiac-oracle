'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Loader2, ChevronDown, User, LogIn, Sparkles } from 'lucide-react';

const ZODIAC_SIGNS = [
  { name: 'Aries', emoji: '♈', period: 'Mar 21 - Apr 19' },
  { name: 'Taurus', emoji: '♉', period: 'Apr 20 - May 20' },
  { name: 'Gemini', emoji: '♊', period: 'May 21 - Jun 21' },
  { name: 'Cancer', emoji: '♋', period: 'Jun 22 - Jul 22' },
  { name: 'Leo', emoji: '♌', period: 'Jul 23 - Aug 22' },
  { name: 'Virgo', emoji: '♍', period: 'Aug 23 - Sep 22' },
  { name: 'Libra', emoji: '♎', period: 'Sep 23 - Oct 23' },
  { name: 'Scorpio', emoji: '♏', period: 'Oct 24 - Nov 22' },
  { name: 'Sagittarius', emoji: '♐', period: 'Nov 23 - Dec 21' },
  { name: 'Capricorn', emoji: '♑', period: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', emoji: '♒', period: 'Jan 20 - Feb 18' },
  { name: 'Pisces', emoji: '♓', period: 'Feb 19 - Mar 20' },
];

const MBTI_TYPES = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

interface UserSession {
  id: string;
  name: string;
  zodiac: string;
  mbti: string;
  messages: Message[];
}

// Generate unique session ID
const generateSessionId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Get or create session
const getSession = (): UserSession | null => {
  if (typeof window === 'undefined') return null;
  const sessionData = localStorage.getItem('zodiac_oracle_session');
  if (sessionData) {
    try {
      return JSON.parse(sessionData);
    } catch {
      return null;
    }
  }
  return null;
};

// Save session
const saveSession = (session: UserSession) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('zodiac_oracle_session', JSON.stringify(session));
};

// Clear session
const clearSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('zodiac_oracle_session');
};

// Suggested questions based on context
const getSuggestions = (zodiac: string, mbti: string, topic?: string): string[] => {
  const baseSuggestions = [
    `What's my ${zodiac} daily luck?`,
    `How compatible is ${mbti} with other types?`,
    `What career suits ${zodiac} + ${mbti}?`,
    `Love advice for ${zodiac} ${mbti}?`,
  ];
  
  if (topic === 'love') {
    return [
      `Who should ${zodiac} ${mbti} date?`,
      `Love compatibility for ${zodiac} ${mbti}`,
      `Will I find love this month?`,
      `${zodiac} ${mbti} relationship tips`,
    ];
  }
  
  if (topic === 'career') {
    return [
      `Best career for ${zodiac} ${mbti}`,
      `Work luck today for ${zodiac}`,
      `Should I change jobs?`,
      `${mbti} work style analysis`,
    ];
  }
  
  return baseSuggestions;
};

export default function Home() {
  const [zodiac, setZodiac] = useState('');
  const [mbti, setMbti] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Initialize session on mount
  useEffect(() => {
    const session = getSession();
    if (session) {
      setCurrentUser(session);
      setZodiac(session.zodiac);
      setMbti(session.mbti);
      setMessages(session.messages);
      if (session.messages.length > 0) {
        setHasStarted(true);
      }
    }
    setMounted(true);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setAutoScroll(true);
  };

  // Login handler
  const handleLogin = () => {
    if (!userName.trim()) return;
    const newSession: UserSession = {
      id: generateSessionId(),
      name: userName.trim(),
      zodiac: '',
      mbti: '',
      messages: [],
    };
    saveSession(newSession);
    setCurrentUser(newSession);
    setShowLogin(false);
    setUserName('');
  };

  // Start chat
  const startChat = (name: string, z: string, m: string) => {
    const session: UserSession = {
      id: currentUser?.id || generateSessionId(),
      name,
      zodiac: z,
      mbti: m,
      messages: [],
    };
    saveSession(session);
    setCurrentUser(session);
    setZodiac(z);
    setMbti(m);
    setHasStarted(true);
  };

  // Send message
  const sendMessage = async (userMessage: string) => {
    if (!zodiac || !mbti) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userMessage };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setAutoScroll(true);

    // Save to session
    const session = getSession();
    if (session) {
      session.messages = updatedMessages;
      saveSession(session);
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zodiac, mbti, message: userMessage }),
      });

      if (!res.ok) throw new Error('Connection lost...');

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let botMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: '' };
      const newMessages = [...updatedMessages, botMessage];
      setMessages(newMessages);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                botMessage.content += parsed.content;
                setMessages([...newMessages.map(m => m.id === botMessage.id ? { ...botMessage } : m)]);
              }
            } catch {}
          }
        }
      }

      // Add suggestions after response
      const suggestions = getSuggestions(zodiac, mbti);
      const finalMessage: Message = { ...botMessage, suggestions };
      setMessages(newMessages.map(m => m.id === botMessage.id ? finalMessage : m));

      // Save to session
      const session = getSession();
      if (session) {
        session.messages = newMessages.map(m => m.id === botMessage.id ? finalMessage : m);
        saveSession(session);
      }
    } catch {
      const errorMsg: Message = { id: (Date.now() + 2).toString(), role: 'assistant', content: 'The stars have temporarily lost their connection. Please try again...' };
      setMessages(prev => [...prev.slice(0, -1), errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset
  const handleReset = () => {
    const session = getSession();
    if (session) {
      session.messages = [];
      session.zodiac = '';
      session.mbti = '';
      saveSession(session);
    }
    setHasStarted(false);
    setMessages([]);
    setZodiac('');
    setMbti('');
  };

  // Logout
  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setHasStarted(false);
    setMessages([]);
    setZodiac('');
    setMbti('');
    setShowLogin(true);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Stars Background */}
      <div className="stars">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="star" style={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`
          }} />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[hsl(45,100%,70%,0.1)] glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-2xl">✨</span>
            <div>
              <h1 className="text-2xl font-bold text-[hsl(45,100%,70%)] glow-text tracking-wide">
                Zodiac MBTI Mystic Oracle
              </h1>
              <p className="text-xs text-[hsl(45,30%,70%)] tracking-widest uppercase">
                Mysteriously Fun · Wildly Inaccurate
              </p>
            </div>
            <span className="text-2xl">✨</span>
          </div>
          
          {/* User Area */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <div className="flex items-center gap-2 text-[hsl(45,30%,70%)]">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{currentUser.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-[hsl(45,30%,50%)] hover:text-[hsl(45,100%,70%)] transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 text-[hsl(45,30%,70%)] hover:text-[hsl(45,100%,70%)] transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm">Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4 gradient-border glow">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-[hsl(45,100%,70%)] glow-text text-center mb-6">
                Enter Your Name
              </h2>
              <div className="space-y-4">
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Your name..."
                  className="input-field h-12 text-center text-lg"
                  autoFocus
                />
                <Button
                  onClick={handleLogin}
                  disabled={!userName.trim()}
                  className="btn-primary w-full h-12"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Start Session
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowLogin(false)}
                  className="w-full text-[hsl(45,30%,50%)]"
                >
                  Continue as Guest
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-4xl min-h-[calc(100vh-140px)]">
        {!hasStarted ? (
          /* Selection Page */
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <div className="inline-block mb-6">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[hsl(45,100%,70%)] to-[hsl(280,60%,50%)] p-1 glow">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[hsl(262,40%,10%)] to-[hsl(262,50%,15%)] flex items-center justify-center text-6xl">
                    🔮
                  </div>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-[hsl(45,100%,70%)] glow-text mb-3">
                Discover Your Destiny
              </h2>
              <p className="text-[hsl(45,30%,70%)] text-lg tracking-wide">
                Reveal the cosmic secrets of your soul
              </p>
            </div>

            <Card className="gradient-border glow">
              <CardContent className="space-y-6 p-8">
                {/* Disclaimer */}
                <div className="text-center p-4 rounded-lg bg-[hsl(262,30%,12%)] border border-[hsl(45,100%,70%,0.1)]">
                  <p className="text-[hsl(45,30%,60%)] text-sm tracking-wide">
                    ⚠️ <span className="text-[hsl(45,100%,70%)] font-medium">Entertainment Only</span> · 
                    This is for fun, <span className="text-[hsl(45,100%,70%)]">NOT</span> real astrology
                  </p>
                </div>

                {/* Zodiac Selection */}
                <div className="space-y-3">
                  <Label className="text-[hsl(45,100%,70%)] text-base font-medium tracking-wide flex items-center gap-2">
                    <span>♈</span> Your Zodiac Sign
                  </Label>
                  <Select value={zodiac} onValueChange={setZodiac}>
                    <SelectTrigger className="select-trigger h-12">
                      <SelectValue placeholder="Select your constellation" />
                    </SelectTrigger>
                    <SelectContent className="select-content">
                      {ZODIAC_SIGNS.map((sign) => (
                        <SelectItem key={sign.name} value={sign.name} className="select-item py-2">
                          <span className="flex items-center gap-3">
                            <span>{sign.emoji}</span>
                            <span>{sign.name}</span>
                            <span className="text-[hsl(45,30%,50%)] text-xs ml-auto">{sign.period}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* MBTI Selection */}
                <div className="space-y-3">
                  <Label className="text-[hsl(45,100%,70%)] text-base font-medium tracking-wide flex items-center gap-2">
                    <span>🧠</span> Your MBTI Type
                  </Label>
                  <Select value={mbti} onValueChange={setMbti}>
                    <SelectTrigger className="select-trigger h-12">
                      <SelectValue placeholder="Select your personality" />
                    </SelectTrigger>
                    <SelectContent className="select-content max-h-64">
                      {MBTI_TYPES.map((type) => (
                        <SelectItem key={type} value={type} className="select-item py-2">
                          <span className="font-mono font-bold text-[hsl(45,100%,70%)]">{type}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Accuracy Badge */}
                <div className="text-center p-3 rounded-lg bg-gradient-to-r from-[hsl(262,30%,12%)] to-[hsl(262,30%,12%)] border border-[hsl(45,100%,70%,0.2)]">
                  <p className="text-[hsl(45,100%,70%)] font-bold tracking-wider">
                    Accuracy Rate: 0.0001%
                  </p>
                </div>

                {/* Start Button */}
                <Button
                  onClick={() => startChat(currentUser?.name || 'Guest', zodiac, mbti)}
                  disabled={!zodiac || !mbti || isLoading}
                  className="btn-primary w-full h-14 text-lg rounded-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Channeling...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Begin Your Reading
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Chat Page */
          <div className="flex flex-col h-[calc(100vh-180px)]">
            <Card className="flex-1 flex flex-col gradient-border glow overflow-hidden">
              {/* Chat Header */}
              <div className="px-6 py-3 border-b border-[hsl(45,100%,70%,0.1)] bg-[hsl(262,40%,8%,0.5)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(45,100%,70%)] to-[hsl(280,60%,50%)] p-0.5">
                      <div className="w-full h-full rounded-full bg-[hsl(262,40%,10%)] flex items-center justify-center">
                        🔮
                      </div>
                    </div>
                    <div>
                      <div className="text-[hsl(45,100%,70%)] font-bold">Mystic Oracle</div>
                      <div className="text-[hsl(45,30%,60%)] text-xs">
                        {zodiac} {ZODIAC_SIGNS.find(s => s.name === zodiac)?.emoji} · {mbti}
                        {currentUser && <span className="ml-2">· {currentUser.name}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-[hsl(45,30%,50%)]">
                    <div>0.0001% Accurate</div>
                    <div>Entertainment Only</div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-6 space-y-4"
                  onScroll={(e: any) => {
                    const target = e.target;
                    const isAtBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
                    setAutoScroll(isAtBottom);
                  }}
                >
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} message-enter`}>
                      <div className="flex gap-2 items-end">
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(45,100%,70%)] to-[hsl(280,60%,50%)] flex items-center justify-center text-sm shrink-0">
                            🔮
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-br from-[hsl(280,60%,50%)] to-[hsl(262,60%,40%)] text-[hsl(45,100%,95%)] rounded-br-sm'
                              : 'bg-[hsl(262,30%,15%)] text-[hsl(45,30%,95%)] rounded-bl-sm border border-[hsl(45,100%,70%,0.1)]'
                          }`}
                        >
                          {msg.content}
                          {isLoading && msg.role === 'assistant' && msg.content === '' && (
                            <span className="inline-flex gap-1 ml-2">
                              <span className="w-1.5 h-1.5 bg-[hsl(45,100%,70%)] rounded-full pulse-dot" />
                              <span className="w-1.5 h-1.5 bg-[hsl(45,100%,70%)] rounded-full pulse-dot" style={{ animationDelay: '0.2s' }} />
                              <span className="w-1.5 h-1.5 bg-[hsl(45,100%,70%)] rounded-full pulse-dot" style={{ animationDelay: '0.4s' }} />
                            </span>
                          )}
                        </div>
                        {msg.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-[hsl(262,40%,30%)] flex items-center justify-center text-sm shrink-0">
                            👤
                          </div>
                        )}
                      </div>
                      
                      {/* Suggestions */}
                      {msg.role === 'assistant' && msg.suggestions && !isLoading && (
                        <div className="mt-3 ml-10 flex flex-wrap gap-2">
                          {msg.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => sendMessage(suggestion)}
                              className="text-xs px-3 py-1.5 rounded-full bg-[hsl(262,30%,15%)] border border-[hsl(45,100%,70%,0.2)] text-[hsl(45,30%,80%)] hover:text-[hsl(45,100%,70%)] hover:border-[hsl(45,100%,70%,0.5)] transition-all cursor-pointer"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Scroll to Bottom */}
                {!autoScroll && messages.length > 2 && (
                  <button
                    onClick={scrollToBottom}
                    className="absolute bottom-24 right-6 w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(45,100%,70%)] to-[hsl(280,60%,50%)] flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                  >
                    <ChevronDown className="w-5 h-5 text-white" />
                  </button>
                )}

                {/* Input Area */}
                <div className="p-4 border-t border-[hsl(45,100%,70%,0.1)] bg-[hsl(262,40%,8%,0.5)]">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (input.trim()) sendMessage(input);
                        }
                      }}
                      placeholder="Ask the oracle..."
                      disabled={isLoading}
                      className="input-field h-11 flex-1"
                    />
                    <Button
                      onClick={() => input.trim() && sendMessage(input)}
                      disabled={isLoading || !input.trim()}
                      size="icon"
                      className="btn-primary h-11 w-11 shrink-0"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-center text-[hsl(45,30%,40%)] text-xs mt-2">
                    Entertainment Only · Not Real Astrology
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Restart Button */}
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                onClick={handleReset}
                className="text-[hsl(45,30%,50%)] hover:text-[hsl(45,100%,70%)] tracking-wide"
              >
                ✧ Start Over ✧
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
