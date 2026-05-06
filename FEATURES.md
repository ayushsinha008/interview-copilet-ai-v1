# Interview Copilot AI - Features & Usage Guide

Comprehensive guide to all features and how to use them effectively.

---

## 🎤 Speech Recognition

### How It Works
1. Click the **microphone button** or press **`Ctrl+Shift+Space`**
2. Start speaking your question
3. The app listens for **2-second silence** to detect end of input
4. Your speech is transcribed to text
5. AI generates an answer based on the text

### Key Features
- **Continuous Listening**: Click once to start, keep speaking multiple questions
- **Silence Detection**: Automatically detects when you finish speaking
- **Noise Filtering**: Filters out background noise (relative to volume)
- **Browser Integration**: Uses native Web Speech API (no extra downloads needed)

### Supported Languages
- English (default)
- Can be extended to support multiple languages in future versions

### Tips for Best Results
- Speak clearly and naturally
- Eliminate background noise
- Use a good quality microphone
- Complete full sentences
- Take a pause between questions

---

## 🤖 AI Answer Generation

### Powered By
**OpenAI GPT-4o-mini** - Fast, cost-effective, professional responses

### Answer Styles

#### Short Style
- 3-4 lines of concise answer
- Quick facts and key points
- Best for quick reference during interview
- **Use when**: You need rapid answers

#### Detailed Style
- 6-8 lines with explanations
- Includes context and examples
- Better for learning
- **Use when**: You want comprehensive understanding

### Smart Context

The AI remembers the **last 2 questions** to provide contextual answers.

**Example:**
```
Q1: "What is React?"
Q2: "How does it compare to Vue?"
→ AI knows you're asking about framework comparison
```

### Response Time
- Typical: 2-5 seconds
- Depends on: Internet speed, OpenAI API load, question complexity
- First answer: Slightly longer (API warmup)

### What It Considers
- Your question text
- Previous 2 questions (context)
- Selected answer style
- Your API plan (rate limits)

---

## ⚙️ Settings Panel

### Accessing Settings
Click the **⚙️ gear icon** in top-right corner of floating window

### Available Settings

#### 1. **OpenAI API Key**
- Enter your API key from [platform.openai.com](https://platform.openai.com)
- Stored securely locally using `electron-store`
- Never transmitted except to OpenAI
- Click **Save** to update

#### 2. **Auto-start Listening**
- ✅ Enabled: App starts listening automatically when it launches
- ❌ Disabled: You need to click 🎤 or press hotkey to start
- Default: Off (more convenient during setup)

#### 3. **Answer Style**
- **Short**: 3-4 line quick answers
- **Detailed**: 6-8 line comprehensive answers
- Switch anytime without restarting

#### 4. **Window Transparency** (optional)
- Adjust window opacity (10% - 100%)
- Lower = more transparent (see through to background)
- Higher = more opaque (easier to read)

---

## 📋 Copy Answers

### Quick Copy
1. Answer appears in the **answer box**
2. Click anywhere on the answer text
3. Answer is **automatically copied** to clipboard
4. Paste anywhere: `Ctrl+V` (Windows/Linux) or `Cmd+V` (macOS)

### Use Cases
- Paste answers into chat/meeting
- Save answers to document
- Share answers with interviewers

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+Space` | Toggle listening on/off (global) |
| `Ctrl+C` | Copy selected answer (when focused) |
| `Alt+F4` | Close app (Windows) |
| `Cmd+Q` | Close app (macOS) |

### Global Hotkey
- `Ctrl+Shift+Space` works **even when app is not focused**
- Great for quick activation during interviews
- Customizable (see roadmap)

---

## 🪟 Window Management

### Floating Window Features
- **Draggable**: Click title bar and drag to move
- **Resizable**: Drag edges/corners to resize
- **Always-on-Top**: Stays above other windows
- **Compact**: 300×400px by default (adjustable)

### Window Controls (Top Right)
- **Settings**: ⚙️ - Open settings panel
- **Minimize**: _ - Hide to taskbar
- **Close**: ✕ - Close the app

### Click-Through Mode (Future)
- Planned feature to click through the window
- Useful for selecting text behind the window
- Will maintain speech recognition

---

## 🔍 Text Input

### Manual Question Input
- Type directly in the question box
- Press **Enter** to send question
- AI will generate answer without speech recognition

### Use Cases
- When microphone unavailable
- For privacy (silent interview)
- When typing is faster
- For editing before sending

---

## 📊 Status Indicators

### Visual Feedback

| Indicator | Meaning |
|-----------|---------|
| 🎤 Idle | Ready to listen |
| 🎤 Pulsing | Listening... |
| ⏳ Loading | Generating answer... |
| ✅ Done | Answer ready |
| ❌ Error | Connection or API issue |

### Error Messages

**Common Errors:**
```
"Invalid API key"
→ Check key is correct, not expired

"Rate limit exceeded"
→ Wait a minute, try again

"No internet connection"
→ Check WiFi/network

"Speech recognition failed"
→ Check microphone, permissions
```

---

## 🎨 UI/UX Elements

### Dark Mode
- Professional dark theme throughout
- Reduces eye strain during interviews
- High contrast for readability

### Answer Box
- Displays AI-generated answers
- Auto-scrolls if text exceeds window height
- Click to copy functionality

### Status Bar
- Shows current listening/processing state
- Displays API status
- Error notifications

---

## 🔐 Data & Privacy

### What Gets Stored Locally
- OpenAI API key (encrypted)
- Settings preferences
- No question/answer history

### What Gets Sent to OpenAI
- Your question text
- Previous 2 questions (context)
- Answer style preference
- Nothing else

### What Gets Logged
- Nothing by default
- Check console (DevTools) for debugging

### Deletion
- Delete settings: Uninstall app or remove config file
- See [SETUP.md](SETUP.md) for config file locations

---

## ⚡ Performance & Optimization

### Response Time Factors

**Faster responses when:**
- Question is simple/direct
- Good internet connection
- Low OpenAI API load

**Slower responses when:**
- Complex, multi-part questions
- Slow internet
- High server load
- First request (API warmup)

### Tips for Speed
1. Use clear, complete sentences
2. Check internet connection
3. Pause between questions (let API cool)
4. Use "Short" style for faster answers

### Memory Usage
- Typical: 200-300MB RAM
- Increases with: Long answer history, large window size
- Decreases when minimized

---

## 🚀 Advanced Usage

### Multiple Interviews
- Settings persist across sessions
- Switch between different API keys in settings
- No data leak between interviews

### Silent Mode
- Use text input instead of speech
- No microphone needed
- Perfect for open office environments

### Focus Mode
- Drag window to corner
- Make transparent (low opacity)
- Keeps assistant visible without distraction

### Accessibility
- Keyboard shortcuts for everything
- Screen reader compatible (partial support)
- High contrast dark theme

---

## 🔄 Offline Capabilities

**What works offline:**
- Speech recognition (buffered)
- Window management
- Settings changes

**What requires internet:**
- AI answer generation (must connect to OpenAI)
- Question transcription (some APIs require internet)

---

## 📱 Device Support

### Current Support
- ✅ Windows 10/11
- ✅ macOS 10.13+
- ✅ Linux (Ubuntu, Fedora, etc.)

### Future Support (Roadmap)
- 📱 iOS app
- 📱 Android app
- 🌐 Browser extension
- ☁️ Cloud version

---

## 💡 Best Practices

### Before Interview
1. ✓ Test speech recognition with sample questions
2. ✓ Verify API key is active and has credits
3. ✓ Ensure microphone works
4. ✓ Grant all permissions
5. ✓ Set preferred answer style

### During Interview
1. ✓ Keep window visible but not intrusive
2. ✓ Speak clearly for better transcription
3. ✓ Use short, focused questions
4. ✓ Read answer quickly, apply to your response
5. ✓ Practice beforehand to know hotkeys

### After Interview
1. ✓ Close app to stop API calls
2. ✓ Review API usage on OpenAI dashboard
3. ✓ Check any error messages in console
4. ✓ Update settings if needed

---

**For more information, see [README.md](README.md) and [SETUP.md](SETUP.md)**
