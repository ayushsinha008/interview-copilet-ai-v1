/// <reference path="../types/global.d.ts" />
import { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff, Key, Headphones, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import TransparencyControl from './TransparencyControl';

interface Settings {
  openaiApiKey: string;
  autoStartListening: boolean;
  answerStyle: 'short' | 'detailed';
}

export interface TransparencySettings {
  opacity: number;
  blurEnabled: boolean;
  clickThrough: boolean;
}

interface SettingsPanelProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
  transparencySettings: TransparencySettings;
  onTransparencyChange: (settings: TransparencySettings) => void;
}

const SettingsPanel = ({ settings, onSave, onClose, transparencySettings, onTransparencyChange }: SettingsPanelProps) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    onSave(localSettings);
    // Save transparency settings
    if (window.electronAPI && window.electronAPI.saveTransparencySettings) {
      window.electronAPI.saveTransparencySettings(transparencySettings);
    }
  };

  const handleChange = (key: keyof Settings, value: any) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleTransparencyChange = (newSettings: TransparencySettings) => {
    onTransparencyChange(newSettings);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="glass-heavy rounded-2xl border border-white/10 shadow-2xl w-full max-w-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <p className="text-xs text-slate-400 mt-1">Configure your Interview Copilot</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
          title="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
        {/* OpenAI API Key */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Key size={16} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">OpenAI API Key</h3>
              <p className="text-xs text-slate-400">Required for AI responses</p>
            </div>
          </div>
          
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={localSettings.openaiApiKey}
              onChange={(e) => handleChange('openaiApiKey', e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <p className="text-xs text-slate-500">
            Your API key is stored locally and never sent to our servers.
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 ml-1"
            >
              Get your key
            </a>
          </p>
        </div>

        {/* Auto-start listening */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Headphones size={16} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Voice Settings</h3>
              <p className="text-xs text-slate-400">Control how the app listens</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
            <div>
              <p className="text-sm font-medium text-white">Auto-start listening</p>
              <p className="text-xs text-slate-400">Start listening when app opens</p>
            </div>
            <button
              onClick={() => handleChange('autoStartListening', !localSettings.autoStartListening)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                localSettings.autoStartListening ? 'bg-emerald-500' : 'bg-slate-700'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  localSettings.autoStartListening ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>
        </div>

        {/* Answer Style */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <MessageSquare size={16} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Answer Style</h3>
              <p className="text-xs text-slate-400">How detailed should answers be?</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleChange('answerStyle', 'short')}
              className={cn(
                'p-4 rounded-xl border transition-all text-left',
                localSettings.answerStyle === 'short'
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              )}
            >
              <div className="text-sm font-medium text-white mb-1">Short</div>
              <p className="text-xs text-slate-400">Concise, 3-4 line answers</p>
            </button>
            
            <button
              onClick={() => handleChange('answerStyle', 'detailed')}
              className={cn(
                'p-4 rounded-xl border transition-all text-left',
                localSettings.answerStyle === 'detailed'
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              )}
            >
              <div className="text-sm font-medium text-white mb-1">Detailed</div>
              <p className="text-xs text-slate-400">Comprehensive explanations</p>
            </button>
          </div>
        </div>

        {/* Window Transparency Control */}
        <div className="space-y-3">
          <TransparencyControl
            settings={transparencySettings}
            onSettingsChange={handleTransparencyChange}
          />
        </div>

        {/* Keyboard Shortcut Info */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <h4 className="text-sm font-medium text-white mb-2">Keyboard Shortcuts</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Toggle listening</span>
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-slate-300">Ctrl+Shift+A</kbd>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Open settings</span>
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-slate-300">Ctrl+,</kbd>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Increase opacity</span>
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-slate-300">Ctrl+↑</kbd>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Decrease opacity</span>
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-slate-300">Ctrl+↓</kbd>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Toggle click‑through</span>
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-slate-300">Ctrl+Shift+X</kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </motion.div>
  );
};

export default SettingsPanel;