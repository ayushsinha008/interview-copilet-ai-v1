/// <reference path="./types/global.d.ts" />
import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Settings, Copy, X, Minimize2, Maximize2, ChevronRight, Volume2, Sparkles, Bot, Check, Loader2, MousePointerClick, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useAIGeneration } from './hooks/useAIGeneration';
import { useClickThroughInteractive } from './hooks/useClickThroughInteractive';
import useWindowResize from './hooks/useWindowResize';
import SettingsPanel from './components/SettingsPanel';
import { TextQuestionInput } from './components/TextQuestionInput';
import ResizeHandles from './components/ResizeHandles';
import { cn } from './lib/utils';
import type { TransparencySettings } from './components/SettingsPanel';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    openaiApiKey: '',
    autoStartListening: true,
    answerStyle: 'short' as 'short' | 'detailed',
  });
  const [context, setContext] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [currentOpacity, setCurrentOpacity] = useState(0.92);
  const [showOpacityIndicator, setShowOpacityIndicator] = useState(false);
  const [transparencySettings, setTransparencySettings] = useState({
    opacity: 0.92,
    blurEnabled: false,
    clickThrough: false,
  });

  const {
    transcript,
    interimTranscript,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onFinalTranscript: (text) => {
      if (text.trim()) {
        handleQuestionDetected(text);
      }
    },
  });

  const { generateAnswer, isLoading, answer, error, clearAnswer } = useAIGeneration();

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await window.electronAPI.getSettings();
        setSettings(saved);
        if (saved.autoStartListening) {
          startListening();
          setIsListening(true);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    loadSettings();
  }, []);

  // Load transparency settings on mount
  useEffect(() => {
    const loadTransparencySettings = async () => {
      try {
        const saved = await window.electronAPI.getTransparencySettings();
        setTransparencySettings(saved);
        // Update currentOpacity to match saved opacity
        setCurrentOpacity(saved.opacity);
      } catch (err) {
        console.error('Failed to load transparency settings:', err);
      }
    };
    loadTransparencySettings();
  }, []);

  // Listen to click-through toggled events
  useEffect(() => {
    if (!window.electronAPI?.onClickThroughToggled) return;
    const handleClickThroughToggled = (enabled: boolean) => {
      setTransparencySettings(prev => ({ ...prev, clickThrough: enabled }));
    };
    window.electronAPI.onClickThroughToggled(handleClickThroughToggled);
    return () => {
      // Cleanup listener if needed
    };
  }, []);

  // Enable dynamic click-through behavior for interactive elements
  useClickThroughInteractive(transparencySettings.clickThrough);

  // Handle keyboard shortcut to toggle listening
  useEffect(() => {
    const handleToggle = () => {
      toggleListening();
    };
    window.electronAPI.onToggleListening(handleToggle);
    return () => {
      window.electronAPI.removeToggleListeningListener();
    };
  }, [isListening]);

  // Listen to opacity changes from keyboard shortcuts
  useEffect(() => {
    if (!window.electronAPI?.onOpacityChanged) return;
    const handleOpacityChanged = (opacity: number) => {
      setCurrentOpacity(opacity);
      setShowOpacityIndicator(true);
      // Hide indicator after 1.5 seconds
      const timer = setTimeout(() => setShowOpacityIndicator(false), 1500);
      return () => clearTimeout(timer);
    };
    window.electronAPI.onOpacityChanged(handleOpacityChanged);
    // No cleanup needed as listener persists
    return () => {};
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      startListening();
      setIsListening(true);
    }
  }, [isListening, startListening, stopListening]);

  const handleQuestionDetected = async (question: string) => {
    // Update context (keep last 2 questions)
    setContext((prev) => {
      const updated = [...prev, question];
      if (updated.length > 2) updated.shift();
      return updated;
    });

    // Generate answer
    try {
      await generateAnswer(question, context);
    } catch (err) {
      console.error('AI generation error:', err);
    }
  };

  const handleCopyAnswer = () => {
    if (answer) {
      navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveSettings = async (newSettings: typeof settings) => {
    try {
      await window.electronAPI.saveSettings(newSettings);
      setSettings(newSettings);
      setShowSettings(false);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  const handleTransparencyChange = async (newSettings: TransparencySettings) => {
    setTransparencySettings(newSettings);
    // Save to store
    if (window.electronAPI?.saveTransparencySettings) {
      await window.electronAPI.saveTransparencySettings(newSettings);
    }
    // Apply blur effect is handled via CSS class change (state update)
    // Apply click-through if changed
    if (window.electronAPI?.setClickThrough) {
      window.electronAPI.setClickThrough(newSettings.clickThrough);
    }
    // Apply opacity if changed
    if (window.electronAPI?.setWindowOpacity) {
      window.electronAPI.setWindowOpacity(newSettings.opacity);
    }
  };

  const toggleClickThrough = () => {
    const newClickThrough = !transparencySettings.clickThrough;
    const newSettings = {
      ...transparencySettings,
      clickThrough: newClickThrough,
    };
    setTransparencySettings(newSettings);
    // Save to store
    if (window.electronAPI?.saveTransparencySettings) {
      window.electronAPI.saveTransparencySettings(newSettings);
    }
    // Apply click-through
    if (window.electronAPI?.setClickThrough) {
      window.electronAPI.setClickThrough(newClickThrough);
    }
  };

  const displayedQuestion = transcript || interimTranscript || 'Speak a question to get started...';
  const statusText = isLoading ? 'Processing...' : isListening ? 'Listening...' : 'Ready';
  const statusColor = isLoading ? 'bg-amber-500' : isListening ? 'bg-emerald-500' : 'bg-slate-500';

  // Use window resize hook
  const { currentBounds, isResizing } = useWindowResize();

  return (
    <div className="flex flex-col h-screen w-screen bg-transparent overflow-hidden select-none font-sans relative">
      {/* Resize handles - only show when not in click-through mode */}
      {!transparencySettings.clickThrough && (
        <ResizeHandles
          className="z-40"
          enabled={!transparencySettings.clickThrough}
          handleSize={10}
        />
      )}
      {/* Floating opacity indicator */}
      <AnimatePresence>
        {showOpacityIndicator && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="glass-heavy rounded-full px-4 py-2 border border-white/20 shadow-2xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-sm font-medium text-white">
                Opacity: {Math.round(currentOpacity * 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main glass container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex-1 rounded-2xl m-3 flex flex-col overflow-hidden border border-white/10 shadow-2xl",
          transparencySettings.blurEnabled ? "glass-heavy" : "glass-heavy-no-blur"
        )}
      >
        {/* Draggable top bar with double-click to maximize */}
        <div
          className="draggable flex items-center justify-between px-5 py-4 border-b border-white/10 cursor-default"
          onDoubleClick={() => window.electronAPI.maximizeWindow()}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                <Bot size={20} className="text-purple-400" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0f1117] ${statusColor}`} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold text-white">Interview Copilot</h1>
              <p className="text-xs text-slate-400">AI Interview Assistant</p>
            </div>
          </div>
          
          <div className="non-draggable flex items-center gap-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
              title="Settings"
            >
              <Settings size={16} />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
              title="Minimize"
              onClick={() => window.electronAPI?.minimizeWindow()}
            >
              <Minimize2 size={16} />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-red-500/20 transition-colors text-slate-400 hover:text-red-400"
              title="Close"
              onClick={() => window.electronAPI?.closeWindow()}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-5 flex flex-col gap-5 overflow-hidden">
          {/* Status & Controls Card */}
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${isListening ? 'pulse-glow' : ''} ${isLoading ? 'bg-amber-500/20' : isListening ? 'bg-emerald-500/20' : 'bg-slate-500/20'} flex items-center justify-center`}>
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin text-amber-400" />
                  ) : isListening ? (
                    <Volume2 size={16} className="text-emerald-400" />
                  ) : (
                    <Mic size={16} className="text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">{statusText}</h3>
                  <p className="text-xs text-slate-400">
                    {isListening ? 'Speak clearly into your microphone' : 'Press button or Ctrl+Shift+A to start'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={toggleListening}
                className={cn(
                  'non-draggable flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 active:scale-95',
                  isListening
                    ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-500/30'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25'
                )}
              >
                {isListening ? (
                  <>
                    <MicOff size={16} />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic size={16} />
                    Start Listening
                  </>
                )}
              </button>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleClickThrough}
                  className={cn(
                    'non-draggable flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                    transparencySettings.clickThrough
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                  )}
                  title={transparencySettings.clickThrough ? "Click-through enabled - Click to disable" : "Click-through disabled - Click to enable"}
                >
                  {transparencySettings.clickThrough ? (
                    <>
                      <MousePointerClick size={12} />
                      Disable Click-through
                    </>
                  ) : (
                    <>
                      <MousePointerClick size={12} />
                      Enable Click-through
                    </>
                  )}
                </button>
                
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Voice recognition active</span>
              </div>
              <span className="non-draggable">Ctrl+Shift+A</span>
            </div>
          </motion.div>

          {/* Detected Question Card */}
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-4 border border-white/10 flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Sparkles size={14} className="text-purple-400" />
                Detected Question
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-400">
                Live
              </span>
            </div>
            
            <div className="flex-1 min-h-[80px] max-h-32 overflow-y-auto scrollbar-hide">
              <p className="text-sm text-slate-300 leading-relaxed">
                {displayedQuestion}
              </p>
            </div>
            
            {transcript && (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">{transcript.length} characters</span>
                <button className="text-purple-400 hover:text-purple-300 transition-colors">
                  Clear
                </button>
              </div>
            )}
          </motion.div>

          {/* Type Question Card */}
          <TextQuestionInput
            onSubmit={handleQuestionDetected}
            isLoading={isLoading}
            disabled={isListening}
          />

          {/* AI Answer Card - Takes most space */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl border border-white/10 flex-1 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Bot size={14} className="text-emerald-400" />
                AI Answer
                {isLoading && (
                  <span className="flex items-center gap-1 ml-2">
                    <span className="typing-dot w-1 h-1 rounded-full bg-emerald-400" />
                    <span className="typing-dot w-1 h-1 rounded-full bg-emerald-400" />
                    <span className="typing-dot w-1 h-1 rounded-full bg-emerald-400" />
                  </span>
                )}
              </h3>
              
              <div className="flex items-center gap-1">
                {answer && (
                  <button
                    onClick={handleCopyAnswer}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white flex items-center gap-1"
                    title="Copy answer"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                )}
                {answer && (
                  <button
                    onClick={clearAnswer}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                    title="Clear answer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-slate-400"
                  >
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-3" />
                    <p className="text-sm">Generating answer...</p>
                    <p className="text-xs mt-1">Analyzing your question</p>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
                  >
                    <p className="font-medium">Error</p>
                    <p className="mt-1">{error}</p>
                  </motion.div>
                ) : answer ? (
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="prose prose-sm prose-invert max-w-none"
                  >
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {answer.split('\n').map((line, i) => (
                        <p key={i} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <Bot size={24} className="text-slate-600" />
                    </div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">No answer yet</h4>
                    <p className="text-xs text-slate-500">
                      Start speaking or type a question to get AI-powered interview answers.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {context.length > 0 && (
              <div className="px-4 py-3 border-t border-white/10 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Using {context.length} previous question(s) for context</span>
                  <button 
                    onClick={() => setContext([])}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Clear context
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>Interview Copilot AI v1.0</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Always listening for your questions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Connected</span>
          </div>
        </div>
      </motion.div>

      {/* Settings Panel Overlay */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md"
            >
              <SettingsPanel
                settings={settings}
                onSave={handleSaveSettings}
                onClose={() => setShowSettings(false)}
                transparencySettings={transparencySettings}
                onTransparencyChange={handleTransparencyChange}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;