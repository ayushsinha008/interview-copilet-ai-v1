# Interview Copilot AI

![Badge](https://img.shields.io/badge/Electron-24-blue?logo=electron) ![Badge](https://img.shields.io/badge/React-19-61dafb?logo=react) ![Badge](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript) ![Badge](https://img.shields.io/badge/License-MIT-green)

A sophisticated floating desktop AI assistant that **listens to interviewer speech in real time**, converts it to text, generates professional answers using **OpenAI GPT-4o-mini**, and displays them in a sleek, always-on-top window. Never miss a beat in your interview again.

**Built with**: Electron · React 19 · Vite · TypeScript · Tailwind CSS · Web Speech API

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🪟 **Floating Window** | Compact (300×400px), draggable, always-on-top design with modern dark theme |
| 🎤 **Real-time Speech Recognition** | Web Speech API with intelligent silence detection (2-sec pause) |
| 🤖 **AI-Powered Answers** | OpenAI GPT-4o-mini generates professional, contextual responses |
| 🧠 **Smart Logic** | Maintains conversation context, detects sentence endings, prevents duplicate API calls |
| ⚙️ **Settings Panel** | Secure local API key storage, auto-start toggle, answer style customization |
| ⌨️ **Keyboard Control** | Global hotkey `Ctrl+Shift+Space` to toggle listening on/off |
| 📋 **One-Click Copy** | Copy AI answers to clipboard instantly |
| ⚡ **Performance** | Debounced API calls, optimized rendering, smooth animations |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Electron 24** | Cross-platform desktop application framework |
| **React 19** | Modern UI components and state management |
| **Vite** | Lightning-fast build tool and dev server |
| **TypeScript** | Type-safe JavaScript for reliability |
| **Tailwind CSS** | Utility-first styling framework |
| **Web Speech API** | Browser-native speech-to-text recognition |
| **OpenAI API** | GPT-4o-mini language model for answer generation |
| **electron-store** | Secure encrypted settings storage |

---

## 📁 Project Architecture

```
interview-copilot-ai/
├── main/
│   └── index.js                 # Electron main process, window management, IPC
├── renderer/
│   ├── App.tsx                  # Root React component
│   ├── main.tsx                 # React entry point
│   ├── index.css                # Global styles
│   ├── components/
│   │   ├── AnswerBox.tsx        # Displays AI-generated answers
│   │   ├── ResizeHandles.tsx    # Window resize UI
│   │   ├── SettingsPanel.tsx    # Settings modal and API key storage
│   │   ├── StatusIndicator.tsx  # Listening/processing status
│   │   ├── TextQuestionInput.tsx # Manual question input
│   │   ├── TransparencyControl.tsx # Window opacity adjustment
│   │   └── WindowControls.tsx   # Min/max/close buttons
│   ├── hooks/
│   │   ├── useAIGeneration.ts   # OpenAI API integration
│   │   ├── useClickThroughInteractive.ts # Click-through window logic
│   │   ├── useSpeechRecognition.ts # Web Speech API wrapper
│   │   └── useWindowResize.ts   # Window resize handling
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   └── types/
│       └── global.d.ts          # TypeScript global definitions
├── preload.js                   # Secure IPC bridge
├── index.html                   # HTML template
├── vite.config.mjs              # Vite configuration
├── tailwind.config.mjs          # Tailwind CSS config
├── postcss.config.mjs           # PostCSS config
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies & scripts
└── README.md                    # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm 9+
- **OpenAI API key** – Get it free at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Operating System**: Windows, macOS, or Linux

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ayushsinha008/interview-copilot-ai-v1.git
   cd interview-copilot-ai-v1
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

The Electron app will launch with the React dev server running.

### Production Build

Create a distributable installer:

```bash
npm run build
```

Find the packaged app in the `release/` folder.

---

## 📝 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Electron + Vite dev server (hot reload) |
| `npm start` | Run the built Electron app (must build first) |
| `npm run build` | Build renderer & create Electron distributable |
| `npm run build:renderer` | Build React frontend only |
| `npm run watch` | Watch mode: rebuild & restart on file changes |
| `npm run preview` | Preview the built Vite app |

---

## ⚙️ Configuration & Usage

### First Launch Setup

1. **Open Settings**: Click the gear icon (⚙️) in the top-right corner
2. **Enter API Key**: Paste your OpenAI API key
3. **Configure Preferences**:
   - ✅ **Auto-start Listening** – Begin listening when app launches
   - 🎯 **Answer Style** – Choose between "short" or "detailed" responses
   - 🔊 **Microphone Permissions** – Grant browser access when prompted

### Interview Mode

1. **Start Listening**: Click the 🎤 icon or press `Ctrl+Shift+Space`
2. **Speak Your Question**: The interviewer asks, you speak
3. **Wait for Answer**: After 2-second pause, AI generates response
4. **Copy or Read**: Click the answer to copy to clipboard
5. **Next Question**: Ready to listen again immediately

---

## 🔒 Security & Privacy

- **Local Storage**: API keys stored securely with `electron-store` (encrypted at rest)
- **No Cloud Sync**: Settings remain on your device only
- **No Data Logging**: Questions/answers not logged or tracked
- **Browser Sandbox**: React runs in isolated Electron renderer process
- **IPC Communication**: Main process validates all inter-process calls

---

## 🛣️ Project Roadmap

- 🎤 Support for multiple language recognition
- 🔄 Integration with additional LLMs (Claude, Gemini)
- 📊 Interview statistics & analytics
- 🎨 Customizable themes and UI layouts
- 🗣️ TTS (text-to-speech) for answers
- 📱 Browser extension version
- ☁️ Cloud sync for cross-device settings

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Mic not detected** | Grant microphone permissions in browser + OS settings |
| **API errors** | Check API key validity in OpenAI dashboard; verify key has sufficient credits |
| **No answer generated** | Ensure complete sentence spoken; check internet connection |
| **App crashes on startup** | Delete `node_modules/`, run `npm install`, then `npm run dev` |
| **Electron not launching** | Update Electron: `npm install electron@latest` |

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**How to contribute:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** – see [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ayush Sinha**  
- GitHub: [@ayushsinha008](https://github.com/ayushsinha008)
- Email: ayush.sinha008@gmail.com

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4o-mini API
- **Electron** community for the desktop framework
- **React** for modern UI components
- **Tailwind CSS** for beautiful styling
- All contributors and testers

---

## 📞 Support

- 📖 **Documentation**: See [SETUP.md](SETUP.md) for detailed setup guide
- 🐛 **Report Bugs**: [GitHub Issues](https://github.com/ayushsinha008/interview-copilot-ai-v1/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/ayushsinha008/interview-copilot-ai-v1/discussions)
- 📧 **Email**: ayush.sinha008@gmail.com

---

<div align="center">

**Made with ❤️ for better interview preparation**

[⭐ Star this repo if you find it helpful!](https://github.com/ayushsinha008/interview-copilot-ai-v1)

</div>
