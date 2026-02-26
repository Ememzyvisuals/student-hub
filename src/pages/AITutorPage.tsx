import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Bot,
  User,
  Loader2,
  Key,
  X,
  AlertCircle
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { useStore } from '@/store/useStore';

interface AITutorPageProps {
  onOpenMenu: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AITutorPage({ onOpenMenu }: AITutorPageProps) {
  const { openRouterApiKey, setOpenRouterApiKey, currentUser, theme } = useStore();
  const isDark = theme === 'dark';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${currentUser?.fullName || 'Student'}! I'm your AI study assistant powered by advanced AI. Ask me anything about your subjects - Mathematics, Physics, Chemistry, Biology, English, and more. I'm here to help you understand concepts and prepare for your exams!`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(openRouterApiKey);
  const [isListening, setIsListening] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<unknown>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    const windowWithSpeech = window as Window & { 
      webkitSpeechRecognition?: new () => { 
        continuous: boolean; 
        interimResults: boolean; 
        start: () => void; 
        stop: () => void;
        onresult: ((event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
      }; 
      SpeechRecognition?: new () => { 
        continuous: boolean; 
        interimResults: boolean; 
        start: () => void; 
        stop: () => void;
        onresult: ((event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
      };
    };
    
    const SpeechRecognitionClass = windowWithSpeech.webkitSpeechRecognition || windowWithSpeech.SpeechRecognition;
    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    const recognition = recognitionRef.current as { start: () => void; stop: () => void } | null;
    if (!recognition) {
      setError('Speech recognition not supported in your browser');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      setError('');
    }
  };

  const speakText = (text: string) => {
    if (!speakEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    setError('');
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setLoading(true);

    try {
      if (!openRouterApiKey) {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Please set your OpenRouter API key in settings to use the AI tutor. Click the settings icon (gear) in the top right to add your key. You can get a free key from openrouter.ai",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
        setLoading(false);
        return;
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'STUDENTHUB NG'
        },
        body: JSON.stringify({
          model: 'arcee-ai/trinity-large-preview:free',
          messages: [
            {
              role: 'system',
              content: `You are a helpful AI tutor for Nigerian students preparing for JAMB, WAEC, NECO and other exams. The student's academic level is ${currentUser?.academicLevel || 'JAMB'}. 
              
              Guidelines:
              - Be encouraging and supportive
              - Explain concepts clearly with examples
              - Use Nigerian context when relevant
              - Break down complex topics into simple steps
              - Provide practice tips and mnemonics
              - Keep responses concise but thorough
              - Format your responses clearly with line breaks
              - Use simple language that students can understand`
            },
            ...messages.slice(-10).map(m => ({
              role: m.role as 'user' | 'assistant',
              content: m.content
            })),
            { role: 'user' as const, content: userInput }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        speakText(data.choices[0].message.content);
      } else if (data.error) {
        throw new Error(data.error.message || 'API returned an error');
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (err) {
      console.error('AI Tutor Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm having trouble connecting. Error: ${errorMessage}\n\nPlease check:\n1. Your API key is correct\n2. You have internet connection\n3. The API key has credits available\n\nGet a free key at openrouter.ai`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    }
    
    setLoading(false);
  };

  const saveApiKey = () => {
    setOpenRouterApiKey(tempApiKey);
    setShowSettings(false);
    setError('')
  };

  return (
    <div className={`min-h-screen flex flex-col pb-0 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Page Header */}
      <PageHeader 
        title="AI Tutor" 
        onOpenMenu={onOpenMenu}
        rightContent={
          <>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSpeakEnabled(!speakEnabled)}
              className={`p-2.5 rounded-xl transition-colors ${speakEnabled ? 'bg-primary/20 text-primary' : isDark ? 'text-white/60 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {speakEnabled ? <Volume2 size={18} strokeWidth={1.5} /> : <VolumeX size={18} strokeWidth={1.5} />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setTempApiKey(openRouterApiKey);
                setShowSettings(true);
              }}
              className={`p-2.5 rounded-xl transition-colors ${isDark ? 'text-white/60 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Settings size={18} strokeWidth={1.5} />
            </motion.button>
          </>
        }
      />

      {/* API Key Warning */}
      {!openRouterApiKey && (
        <div className="px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <GlassCard className="border-yellow-500/50" hover={false}>
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>API Key Required</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                    Click the settings icon to add your OpenRouter API key. Get a free key at openrouter.ai
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' ? 'bg-primary' : 'bg-gradient-to-br from-accent to-purple-600'
              }`}>
                {message.role === 'user' ? <User size={18} className="text-white" strokeWidth={1.5} /> : <Bot size={18} className="text-white" strokeWidth={1.5} />}
              </div>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user' 
                  ? 'bg-primary text-white rounded-br-md' 
                  : isDark 
                    ? 'bg-white/10 text-white rounded-bl-md'
                    : 'bg-white text-gray-900 rounded-bl-md border border-gray-200 shadow-sm'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center">
                <Bot size={18} className="text-white" strokeWidth={1.5} />
              </div>
              <div className={`${isDark ? 'bg-white/10' : 'bg-white border border-gray-200 shadow-sm'} rounded-2xl rounded-bl-md px-4 py-3`}>
                <div className="flex items-center gap-2">
                  <Loader2 className={`w-4 h-4 animate-spin ${isDark ? 'text-white/60' : 'text-gray-400'}`} />
                  <span className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input - Fixed at bottom */}
      <div className={`sticky bottom-0 px-4 py-4 ${isDark ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-xl border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex gap-3 max-w-2xl mx-auto">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleListening}
            className={`p-3.5 rounded-xl flex-shrink-0 transition-all ${
              isListening 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                : isDark 
                  ? 'bg-white/10 text-white/60 hover:bg-white/20' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isListening ? <MicOff size={20} strokeWidth={1.5} /> : <Mic size={20} strokeWidth={1.5} />}
          </motion.button>
          
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask me anything..."
            className={`flex-1 px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-base ${
              isDark 
                ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30'
                : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
            }`}
          />
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="p-3.5 rounded-xl bg-primary text-white disabled:opacity-50 flex-shrink-0 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
          >
            <Send size={20} strokeWidth={1.5} />
          </motion.button>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-md ${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-white/10' : 'border-gray-200'} shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  AI Settings
                </h2>
                <button onClick={() => setShowSettings(false)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-white/60 hover:bg-white/10' : 'text-gray-400 hover:bg-gray-100'}`}>
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="OpenRouter API Key"
                  type="password"
                  placeholder="sk-or-v1-..."
                  icon={<Key size={18} strokeWidth={1.5} />}
                  value={tempApiKey}
                  onChange={e => setTempApiKey(e.target.value)}
                />
                
                <GlassCard hover={false}>
                  <p className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>How to get your API key:</p>
                  <ol className={`list-decimal list-inside space-y-2 text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                    <li>Visit <span className="text-primary font-medium">openrouter.ai</span></li>
                    <li>Create a free account</li>
                    <li>Go to Keys section</li>
                    <li>Create a new API key</li>
                    <li>Copy and paste it here</li>
                  </ol>
                  <p className={`text-xs mt-4 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                    The free tier includes access to Llama models which power this AI tutor.
                  </p>
                </GlassCard>

                <Button onClick={saveApiKey} fullWidth>
                  Save Settings
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
