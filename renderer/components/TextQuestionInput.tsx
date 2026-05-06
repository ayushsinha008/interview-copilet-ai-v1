import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, X, History, ChevronDown, Loader2, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface TextQuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const MAX_LENGTH = 1000;
const HISTORY_LIMIT = 5;

export const TextQuestionInput = ({ onSubmit, isLoading, disabled = false }: TextQuestionInputProps) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<string[]>(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem('interview-copilot-question-history');
    return saved ? JSON.parse(saved).slice(0, HISTORY_LIMIT) : [];
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [input]);

  // Save history to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('interview-copilot-question-history', JSON.stringify(history));
    }
  }, [history]);

  // Close history dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || disabled) return;

    // Add to history (avoid duplicates)
    setHistory(prev => {
      const filtered = prev.filter(q => q !== trimmed);
      return [trimmed, ...filtered].slice(0, HISTORY_LIMIT);
    });

    onSubmit(trimmed);
    setInput('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    }
    // Shift+Enter is allowed for new line (default behavior)
  };

  const handleClear = () => {
    setInput('');
    textareaRef.current?.focus();
  };

  const handleSelectHistory = (question: string) => {
    setInput(question);
    setShowHistory(false);
    textareaRef.current?.focus();
  };

  const handleRemoveHistoryItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('interview-copilot-question-history');
  };

  const charactersRemaining = MAX_LENGTH - input.length;
  const isNearLimit = charactersRemaining < 100;
  const isOverLimit = charactersRemaining < 0;

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="glass rounded-xl p-4 border border-white/10 flex flex-col"
      ref={containerRef}
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          <Paperclip size={14} className="text-purple-400" />
          Type Question
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={cn(
              "p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1",
              showHistory
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
            title="Recent questions"
          >
            <History size={12} />
            <span className="hidden sm:inline">History</span>
            <ChevronDown size={10} className={cn("transition-transform", showHistory ? "rotate-180" : "")} />
          </button>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors p-1"
              title="Clear history"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* History dropdown */}
      <AnimatePresence>
        {showHistory && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 overflow-hidden"
          >
            <div className="glass rounded-lg border border-white/10 p-2 max-h-40 overflow-y-auto">
              <p className="text-xs text-slate-400 mb-2 px-2">Recent questions:</p>
              <ul className="space-y-1">
                {history.map((question, idx) => (
                  <li
                    key={idx}
                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => handleSelectHistory(question)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 truncate">{question}</p>
                      <p className="text-xs text-slate-500">{question.length} chars</p>
                    </div>
                    <button
                      onClick={(e) => handleRemoveHistoryItem(idx, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove from history"
                    >
                      <X size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Textarea container with focus glow */}
      <div className={cn(
        "relative rounded-xl border transition-all duration-300 mb-3",
        isFocused
          ? "border-purple-500/50 shadow-lg shadow-purple-500/20"
          : "border-white/10 hover:border-white/20"
      )}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type your interview question here…"
          className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 resize-none outline-none p-3 rounded-xl min-h-[80px] max-h-40 scrollbar-hide"
          disabled={isLoading || disabled}
          rows={3}
        />
        {/* Character counter */}
        <div className="absolute bottom-2 right-2">
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            isOverLimit
              ? "bg-red-500/20 text-red-300"
              : isNearLimit
                ? "bg-amber-500/20 text-amber-300"
                : "bg-white/5 text-slate-400"
          )}>
            {charactersRemaining}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            disabled={!input.trim()}
            className={cn(
              "px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1",
              input.trim()
                ? "text-slate-400 hover:text-white hover:bg-white/10"
                : "text-slate-600 cursor-not-allowed"
            )}
          >
            <X size={14} />
            Clear
          </button>
          <div className="text-xs text-slate-500 hidden sm:block">
            <kbd className="px-1.5 py-0.5 bg-white/5 rounded">Shift</kbd> + <kbd className="px-1.5 py-0.5 bg-white/5 rounded">Enter</kbd> for new line
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading || disabled}
          className={cn(
            "px-4 py-2.5 rounded-full font-medium transition-all transform flex items-center gap-2",
            "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25",
            "hover:shadow-xl hover:shadow-purple-600/40 hover:scale-105 active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send size={16} />
              Send
            </>
          )}
        </button>
      </div>

      {/* Helper text */}
      <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-500 flex items-center justify-between">
        <span>Press <kbd className="px-1.5 py-0.5 bg-white/5 rounded">Enter</kbd> to submit • <kbd className="px-1.5 py-0.5 bg-white/5 rounded">Ctrl+Enter</kbd> force submit</span>
        <span className="text-slate-400">{input.length} / {MAX_LENGTH}</span>
      </div>
    </motion.div>
  );
};