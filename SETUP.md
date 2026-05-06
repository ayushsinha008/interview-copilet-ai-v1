# Setup Guide - Interview Copilot AI

Complete step-by-step guide to get Interview Copilot AI running on your system.

---

## 📋 Prerequisites

### System Requirements
- **Windows 10/11**, **macOS 10.13+**, or **Linux** (Ubuntu 18.04+)
- **8GB RAM** minimum (4GB should work, but 8GB+ recommended)
- **2GB free disk space**
- **Internet connection** (required for OpenAI API calls)

### Software Requirements
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm 9+** (comes with Node.js)
- **Git** (optional, for cloning repo) - [Download](https://git-scm.com/)
- **OpenAI API Key** - [Get one free](https://platform.openai.com/api-keys)

---

## ⬇️ Installation Steps

### Step 1: Get the Code

**Option A: Clone from GitHub**
```bash
git clone https://github.com/ayushsinha008/interview-copilot-ai-v1.git
cd interview-copilot-ai-v1
```

**Option B: Download ZIP**
- Go to [GitHub repository](https://github.com/ayushsinha008/interview-copilot-ai-v1)
- Click **Code** → **Download ZIP**
- Extract the ZIP file
- Open terminal/PowerShell in extracted folder

### Step 2: Install Dependencies

```bash
npm install
```

This downloads all required packages (~500MB). Takes 2-5 minutes depending on internet speed.

### Step 3: Start Development Server

```bash
npm run dev
```

The app will:
1. Build the React frontend (Vite)
2. Launch Electron window
3. Open with hot reload enabled

You should see a floating dark window appear on your screen.

---

## 🔑 API Key Setup

### Getting an OpenAI API Key

1. **Visit** [platform.openai.com](https://platform.openai.com)
2. **Sign up** or **Log in**
3. **Go to** API Keys section
4. **Create new API key**
5. **Copy** the key (only shown once!)

**⚠️ Important**: 
- Never share your API key
- Store it securely
- Rotate it if compromised
- The key works across all OpenAI API calls

### First Launch Configuration

1. Click the **⚙️ Settings icon** (top-right corner of floating window)
2. Paste your OpenAI API key in the input field
3. (Optional) Toggle **Auto-start Listening**
4. Click **Save Settings**

Settings are stored locally - never transmitted anywhere.

---

## 🎤 Testing Speech Recognition

### Check Microphone Permission

**Windows 10/11:**
- Settings → Privacy & Security → Microphone
- Ensure app has microphone access
- Google Chrome/Chromium-based apps need permission

**macOS:**
- System Preferences → Security & Privacy → Microphone
- Allow the terminal/IDE you're using

**Linux:**
- Most distributions grant access by default
- Check PulseAudio/ALSA settings if issues occur

### Test the App

1. **Start listening**: Click 🎤 or press `Ctrl+Shift+Space`
2. **Speak a test question**: "What is React?"
3. **Wait for response**: ~2-5 seconds
4. **Check the answer**: Should appear in the answer box

---

## 📦 Building for Distribution

### Create Installer

```bash
npm run build
```

This:
1. Builds optimized React bundle
2. Creates Electron installer
3. Places output in `release/` folder

### Supported Formats
- **Windows**: `.exe` installer
- **macOS**: `.dmg` disk image
- **Linux**: `.AppImage` or `.deb` package

---

## 🔧 Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with hot reload |
| `npm start` | Run built app (requires npm run build first) |
| `npm run build` | Build production executable |
| `npm run build:renderer` | Build React frontend only |
| `npm run watch` | Watch mode (rebuild on file changes) |
| `npm run preview` | Preview built app locally |

---

## 🐛 Troubleshooting

### **Issue: Dependencies installation fails**

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -r node_modules    # macOS/Linux
rmdir /s node_modules  # Windows

# Reinstall
npm install
```

### **Issue: Microphone not detected**

**Windows:**
```bash
# Check default audio device in Settings
Settings → Sound → Advanced → App volume and device preferences
```

**macOS:**
```bash
# Grant microphone permission to browser
System Preferences → Security & Privacy → Microphone
```

**Linux:**
```bash
# Install audio drivers if needed
sudo apt install pulseaudio  # Ubuntu/Debian
```

### **Issue: "OpenAI API error" or "Invalid API key"**

**Solutions:**
1. ✓ Verify key is copied correctly (no extra spaces)
2. ✓ Check key hasn't been revoked on OpenAI dashboard
3. ✓ Ensure account has available credits
4. ✓ Check internet connection
5. ✓ Try with a fresh API key

### **Issue: App won't start (Electron crash)**

**Solution:**
```bash
# Force rebuild everything
npm run build
npm start
```

### **Issue: Hot reload not working**

**Solution:**
```bash
# Stop current process (Ctrl+C)
# Clear Vite cache
rm -rf dist    # macOS/Linux
rmdir /s dist  # Windows

# Restart
npm run dev
```

### **Issue: Answer generation takes too long**

**Check:**
1. Internet connection speed
2. OpenAI API status at [status.openai.com](https://status.openai.com)
3. API rate limits (check OpenAI dashboard)
4. System resources (check Task Manager)

---

## 🔐 Security Best Practices

1. **Never commit API keys** - they go in `.env` or settings
2. **Rotate keys regularly** - if exposed, generate new one
3. **Use environment variables** for sensitive data
4. **Keep Node.js updated** - `npm outdated` to check
5. **Run security audit** - `npm audit` to find vulnerabilities

---

## 📊 Performance Optimization

### Reducing Memory Usage
```bash
# Monitor process
node --max-old-space-size=512 main/index.js
```

### Faster Builds
```bash
# Use esbuild instead of default transpiler
# Edit vite.config.mjs and adjust optimization
```

### Reducing Window Resource Usage
- Adjust answer box refresh rate
- Reduce animation frame rate in renderer/index.css

---

## 🔄 Updating the App

### Get Latest Changes
```bash
git pull upstream main
npm install
npm run dev
```

### Update Dependencies
```bash
npm update
npm audit fix  # Fix security vulnerabilities
```

---

## 💾 Backing Up Settings

Settings are stored in:

**Windows:**
```
C:\Users\[USERNAME]\AppData\Roaming\interview-copilot-ai\config.json
```

**macOS:**
```
~/Library/Application Support/interview-copilot-ai/config.json
```

**Linux:**
```
~/.config/interview-copilot-ai/config.json
```

Backup these files to preserve settings when reinstalling.

---

## 📚 Additional Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## ❓ Getting Help

- 🐛 **Report Bugs**: [GitHub Issues](https://github.com/ayushsinha008/interview-copilot-ai-v1/issues)
- 💬 **Ask Questions**: [GitHub Discussions](https://github.com/ayushsinha008/interview-copilot-ai-v1/discussions)
- 📧 **Email**: ayush.sinha008@gmail.com
- 📖 **Check**: [README.md](README.md) for quick reference

---

**Happy coding! 🚀**
