import { Minimize, Maximize2, X, Square } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

const WindowControls = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMinimize = () => {
    window.electronAPI.minimizeWindow();
  };

  const handleMaximize = () => {
    window.electronAPI.maximizeWindow();
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    window.electronAPI.closeWindow();
  };

  // Listen for window maximize/unmaximize events
  useEffect(() => {
    // In a real implementation, you would listen to IPC events from main process
    // For now, we'll just toggle on click
  }, []);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleMinimize}
        className={cn(
          'non-draggable p-1.5 rounded-lg hover:bg-white/10 transition-colors',
          'text-slate-400 hover:text-white'
        )}
        title="Minimize"
      >
        <Minimize size={14} />
      </button>
      <button
        onClick={handleMaximize}
        className={cn(
          'non-draggable p-1.5 rounded-lg hover:bg-white/10 transition-colors',
          'text-slate-400 hover:text-white'
        )}
        title={isMaximized ? "Restore" : "Maximize"}
      >
        {isMaximized ? <Square size={12} /> : <Maximize2 size={14} />}
      </button>
      <button
        onClick={handleClose}
        className={cn(
          'non-draggable p-1.5 rounded-lg hover:bg-red-500/20 transition-colors',
          'text-slate-400 hover:text-red-400'
        )}
        title="Close"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default WindowControls;