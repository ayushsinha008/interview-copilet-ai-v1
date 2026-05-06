import { Copy, Loader2, XCircle, Check } from 'lucide-react';
import { useState } from 'react';

interface AnswerBoxProps {
  answer: string;
  isLoading: boolean;
  error: string | null;
  onCopy: () => void;
  onClear: () => void;
}

const AnswerBox = ({ answer, isLoading, error, onCopy, onClear }: AnswerBoxProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-secondary/50 rounded-xl p-3 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-muted-foreground">AI Answer</h3>
        <div className="flex items-center gap-1">
          {answer && (
            <>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                title="Copy answer"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <button
                onClick={onClear}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                title="Clear answer"
              >
                <XCircle size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-[80px] max-h-48">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-sm">Generating answer...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-destructive">
            <XCircle size={24} />
            <p className="text-sm mt-2 text-center">{error}</p>
          </div>
        ) : answer ? (
          <div className="text-sm whitespace-pre-wrap">{answer}</div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-sm text-center">
              Your AI‑generated answer will appear here after a question is detected.
            </p>
          </div>
        )}
      </div>

      {answer && !isLoading && !error && (
        <div className="mt-2 text-xs text-muted-foreground">
          Answer generated using GPT‑4o‑mini
        </div>
      )}
    </div>
  );
};

export default AnswerBox;