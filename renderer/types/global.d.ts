// Web Speech API Type Definitions
type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'language-not-supported'
  | '';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  abort(): void;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
  prototype: SpeechRecognition;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: SpeechRecognitionErrorCode;
  readonly message: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface Window {
  SpeechRecognition: SpeechRecognitionConstructor;
  webkitSpeechRecognition: SpeechRecognitionConstructor;
  electronAPI: {
    getSettings: () => Promise<any>;
    saveSettings: (settings: any) => Promise<any>;
    generateAnswer: (question: string, context: string[]) => Promise<string>;
    minimizeWindow: () => void;
    maximizeWindow: () => void;
    closeWindow: () => void;
    // Window resize controls
    resizeWindow: (width: number, height: number) => void;
    setWindowBounds: (bounds: { x: number; y: number; width: number; height: number }) => void;
    getWindowBounds: () => Promise<{ x: number; y: number; width: number; height: number }>;
    saveWindowBounds: (bounds: { x: number; y: number; width: number; height: number }) => Promise<{ success: boolean }>;
    getWindowSizeLimits: () => Promise<{
      minWidth: number;
      minHeight: number;
      maxWidth: number;
      maxHeight: number;
      defaultWidth: number;
      defaultHeight: number;
    }>;
    onToggleListening: (callback: () => void) => void;
    removeToggleListeningListener: () => void;
    getTransparencySettings: () => Promise<{
      opacity: number;
      blurEnabled: boolean;
      clickThrough: boolean;
    }>;
    saveTransparencySettings: (settings: any) => Promise<any>;
    setWindowOpacity: (opacity: number) => void;
    setClickThrough: (enabled: boolean) => void;
    setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => void;
    onOpacityChanged: (callback: (opacity: number) => void) => void;
    onClickThroughToggled: (callback: (enabled: boolean) => void) => void;
  };
}