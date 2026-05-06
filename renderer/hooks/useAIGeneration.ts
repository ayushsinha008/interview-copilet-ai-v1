import { useState, useCallback, useRef } from 'react';

export const useAIGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const generateAnswer = useCallback(async (question: string, context: string[]) => {
    if (!question.trim()) {
      setError('No question provided');
      return;
    }

    // Debounce: cancel previous pending call
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set a debounce delay of 500ms to avoid rapid successive calls
    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await window.electronAPI.generateAnswer(question, context);
        setAnswer(result);
      } catch (err: any) {
        console.error('AI generation failed:', err);
        setError(err.message || 'Failed to generate answer. Check your API key and internet connection.');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, []);

  const clearAnswer = useCallback(() => {
    setAnswer('');
    setError(null);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
  }, []);

  return {
    generateAnswer,
    isLoading,
    answer,
    error,
    clearAnswer,
  };
};