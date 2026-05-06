import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, Ghost, Sun, Moon, Filter, MousePointerClick } from 'lucide-react';
import { cn } from '../lib/utils';

interface TransparencySettings {
  opacity: number;
  blurEnabled: boolean;
  clickThrough: boolean;
}

interface TransparencyControlProps {
  settings: TransparencySettings;
  onSettingsChange: (settings: TransparencySettings) => void;
}

const TransparencyControl = ({ settings, onSettingsChange }: TransparencyControlProps) => {
  const [localOpacity, setLocalOpacity] = useState(settings.opacity);
  const [localBlur, setLocalBlur] = useState(settings.blurEnabled);
  const [localClickThrough, setLocalClickThrough] = useState(settings.clickThrough);

  // Sync with parent settings
  useEffect(() => {
    setLocalOpacity(settings.opacity);
    setLocalBlur(settings.blurEnabled);
    setLocalClickThrough(settings.clickThrough);
  }, [settings]);

  const handleOpacityChange = (value: number) => {
    const newOpacity = Math.round(value * 100) / 100;
    setLocalOpacity(newOpacity);
    onSettingsChange({ ...settings, opacity: newOpacity });
    // Update window opacity in real-time
    if (window.electronAPI) {
      window.electronAPI.setWindowOpacity(newOpacity);
    }
  };

  const handleBlurToggle = () => {
    const newBlur = !localBlur;
    setLocalBlur(newBlur);
    onSettingsChange({ ...settings, blurEnabled: newBlur });
  };

  const handleClickThroughToggle = () => {
    const newClickThrough = !localClickThrough;
    setLocalClickThrough(newClickThrough);
    onSettingsChange({ ...settings, clickThrough: newClickThrough });
    if (window.electronAPI) {
      window.electronAPI.setClickThrough(newClickThrough);
    }
  };

  const applyPreset = (preset: 'solid' | 'default' | 'transparent' | 'ghost') => {
    let opacity = 1.0;
    switch (preset) {
      case 'solid':
        opacity = 1.0;
        break;
      case 'default':
        opacity = 0.92;
        break;
      case 'transparent':
        opacity = 0.7;
        break;
      case 'ghost':
        opacity = 0.4;
        break;
    }
    handleOpacityChange(opacity);
  };

  const opacityPercent = Math.round(localOpacity * 100);

  // Quick preset buttons
  const presets = [
    { id: 'solid', label: 'Solid', icon: Sun, opacity: 1.0, color: 'bg-blue-500/20 text-blue-400' },
    { id: 'default', label: 'Default', icon: Eye, opacity: 0.92, color: 'bg-purple-500/20 text-purple-400' },
    { id: 'transparent', label: 'Transparent', icon: EyeOff, opacity: 0.7, color: 'bg-amber-500/20 text-amber-400' },
    { id: 'ghost', label: 'Ghost', icon: Ghost, opacity: 0.4, color: 'bg-slate-500/20 text-slate-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
          <Zap size={20} className="text-indigo-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Window Transparency</h3>
          <p className="text-xs text-slate-400">Adjust overlay appearance and behavior</p>
        </div>
      </div>

      {/* Opacity Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white">Opacity</label>
          <span className="text-sm font-mono text-slate-300">{opacityPercent}%</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="20"
            max="100"
            step="1"
            value={opacityPercent}
            onChange={(e) => handleOpacityChange(parseInt(e.target.value) / 100)}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div className="absolute top-3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-indigo-500 rounded pointer-events-none" 
               style={{ width: `${opacityPercent}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>20%</span>
          <span>40%</span>
          <span>60%</span>
          <span>80%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white">Quick Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => {
            const Icon = preset.icon;
            const isActive = Math.abs(localOpacity - preset.opacity) < 0.01;
            return (
              <motion.button
                key={preset.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => applyPreset(preset.id as any)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all',
                  isActive
                    ? 'border-indigo-500/50 bg-indigo-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                )}
              >
                <Icon size={16} className={preset.color.split(' ')[1]} />
                <span className="text-sm text-white">{preset.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-4">

        {/* Click-through Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <MousePointerClick size={16} className="text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Click‑through Mode</h4>
              <p className="text-xs text-slate-400">Mouse passes through transparent areas</p>
              <p className="text-xs text-slate-500 mt-1">Hotkey: Ctrl+Shift+X</p>
            </div>
          </div>
          <button
            onClick={handleClickThroughToggle}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              localClickThrough ? 'bg-amber-500' : 'bg-white/20'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                localClickThrough ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-slate-400">
          <span className="text-slate-300">Keyboard shortcuts:</span>{' '}
          <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Ctrl + ↑</kbd> increase opacity,{' '}
          <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Ctrl + ↓</kbd> decrease opacity
        </p>
      </div>
    </div>
  );
};

export default TransparencyControl;