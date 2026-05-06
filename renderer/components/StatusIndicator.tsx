import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatusIndicatorProps {
  isListening: boolean;
  isProcessing: boolean;
}

const StatusIndicator = ({ isListening, isProcessing }: StatusIndicatorProps) => {
  let statusText = 'Ready';
  let icon = <MicOff size={16} className="text-muted-foreground" />;
  let colorClass = 'text-muted-foreground';

  if (isProcessing) {
    statusText = 'Processing AI...';
    icon = <Loader2 size={16} className="animate-spin text-blue-400" />;
    colorClass = 'text-blue-400';
  } else if (isListening) {
    statusText = 'Listening...';
    icon = <Mic size={16} className="text-green-400 animate-pulse" />;
    colorClass = 'text-green-400';
  }

  return (
    <div className="flex items-center gap-2">
      <div className={cn('p-2 rounded-full bg-secondary/50', colorClass)}>
        {icon}
      </div>
      <div>
        <p className={cn('text-sm font-medium', colorClass)}>{statusText}</p>
        <p className="text-xs text-muted-foreground">
          {isListening ? 'Speak clearly into your microphone' : 'Press start to begin'}
        </p>
      </div>
    </div>
  );
};

export default StatusIndicator;