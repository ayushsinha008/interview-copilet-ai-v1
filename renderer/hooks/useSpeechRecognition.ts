import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  onFinalTranscript?: (text: string) => void;
  language?: string;
  silenceTimeout?: number; // ms of silence to consider sentence complete
}

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}) => {
  const {
    onFinalTranscript,
    language = 'en-US',
    silenceTimeout = 2000, // 2 seconds
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = language;

    rec.onstart = () => {
      setIsRecording(true);
      console.log('Speech recognition started');
    };

    rec.onend = () => {
      setIsRecording(false);
      console.log('Speech recognition ended');
    };

    rec.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      if (final) {
        setTranscript((prev) => prev + ' ' + final);
        if (onFinalTranscript) {
          onFinalTranscript(final.trim());
        }
        setInterimTranscript('');
      } else {
        setInterimTranscript(interim);
      }

      // Reset silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      silenceTimerRef.current = setTimeout(() => {
        if (interim.trim()) {
          // Treat interim as final after silence
          const text = interim.trim();
          setTranscript((prev) => prev + ' ' + text);
          if (onFinalTranscript) {
            onFinalTranscript(text);
          }
          setInterimTranscript('');
        }
      }, silenceTimeout);
    };

    rec.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    setRecognition(rec);

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (rec) {
        rec.stop();
      }
    };
  }, [language, silenceTimeout, onFinalTranscript]);

  const startListening = useCallback(() => {
    if (recognition && !isRecording) {
      recognition.start();
    }
  }, [recognition, isRecording]);

  const stopListening = useCallback(() => {
    if (recognition && isRecording) {
      recognition.stop();
    }
  }, [recognition, isRecording]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isRecording,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
  };
};