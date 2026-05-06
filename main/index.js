const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
console.log('app:', app);
const path = require('path');
const Store = require('electron-store');
const { OpenAI } = require('openai');

// Initialize store for settings
const store = new Store();

let mainWindow = null;
let isListening = false;

// Window size constants
const MIN_WIDTH = 320;
const MIN_HEIGHT = 500;
const MAX_WIDTH = 900;
const MAX_HEIGHT = 1200;
const DEFAULT_WIDTH = 380;
const DEFAULT_HEIGHT = 700;

// Create the floating window
function createWindow() {
  // Load saved window size and position
  const savedBounds = store.get('window.bounds');
  const width = savedBounds?.width || DEFAULT_WIDTH;
  const height = savedBounds?.height || DEFAULT_HEIGHT;
  const x = savedBounds?.x || 100;
  const y = savedBounds?.y || 100;

  mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    resizable: true,
    movable: true,
    skipTaskbar: true,
    roundedCorners: true,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    maxWidth: MAX_WIDTH,
    maxHeight: MAX_HEIGHT,
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Apply initial transparency settings
  const initialOpacity = store.get('transparency.opacity', 0.92);
  mainWindow.setOpacity(initialOpacity);
  const clickThrough = store.get('transparency.clickThrough', false);
  if (clickThrough) {
    mainWindow.setIgnoreMouseEvents(true, { forward: true });
  }

  // Load the React app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Open DevTools in development
  // mainWindow.webContents.openDevTools({ mode: 'detach' });

  // Save window bounds on resize/move
  mainWindow.on('resize', () => {
    if (mainWindow) {
      const bounds = mainWindow.getBounds();
      store.set('window.bounds', bounds);
    }
  });

  mainWindow.on('move', () => {
    if (mainWindow) {
      const bounds = mainWindow.getBounds();
      store.set('window.bounds', bounds);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Register global shortcut for toggling listening (Ctrl+Shift+A)
  globalShortcut.register('CommandOrControl+Shift+A', () => {
    if (mainWindow) {
      mainWindow.webContents.send('toggle-listening');
    }
  });
}

// Initialize OpenAI client
function getOpenAIClient() {
  const apiKey = store.get('openaiApiKey');
  if (!apiKey) {
    console.warn('OpenAI API key not set');
    return null;
  }
  return new OpenAI({ apiKey });
}

// App lifecycle
app.whenReady().then(() => {
  // Handle IPC messages from renderer
  ipcMain.handle('get-settings', () => {
    return {
      openaiApiKey: store.get('openaiApiKey') || '',
      autoStartListening: store.get('autoStartListening') ?? true,
      answerStyle: store.get('answerStyle') || 'short',
    };
  });

  ipcMain.handle('save-settings', (event, settings) => {
    store.set('openaiApiKey', settings.openaiApiKey);
    store.set('autoStartListening', settings.autoStartListening);
    store.set('answerStyle', settings.answerStyle);
    return { success: true };
  });

  ipcMain.handle('generate-answer', async (event, question, context) => {
    const openai = getOpenAIClient();
    if (!openai) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `You are an interview assistant. Give a ${
      store.get('answerStyle') === 'short' ? 'short, confident, professional answer in 3-4 lines' : 'detailed, thorough answer'
    }.
    
    Previous questions for context:
    ${context?.map((q, i) => `${i + 1}. ${q}`).join('\n') || 'None'}
    
    Current question: ${question}
    
    Answer:`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI error:', error);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  });

  // Window control IPC
  ipcMain.on('minimize-window', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.minimize();
  });

  ipcMain.on('maximize-window', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  });

  ipcMain.on('close-window', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.close();
  });

  // Window resize IPC
  ipcMain.on('resize-window', (event, { width, height }) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      const [currentWidth, currentHeight] = win.getSize();
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width));
      const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, height));
      win.setSize(newWidth, newHeight);
    }
  });

  ipcMain.on('set-window-bounds', (event, { x, y, width, height }) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width));
      const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, height));
      win.setBounds({ x, y, width: newWidth, height: newHeight });
    }
  });

  ipcMain.handle('get-window-bounds', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      const bounds = win.getBounds();
      return bounds;
    }
    return null;
  });

  ipcMain.handle('save-window-bounds', (event, bounds) => {
    store.set('window.bounds', bounds);
    return { success: true };
  });

  ipcMain.handle('get-window-size-limits', () => {
    return {
      minWidth: MIN_WIDTH,
      minHeight: MIN_HEIGHT,
      maxWidth: MAX_WIDTH,
      maxHeight: MAX_HEIGHT,
      defaultWidth: DEFAULT_WIDTH,
      defaultHeight: DEFAULT_HEIGHT,
    };
  });

  // Transparency control IPC
  ipcMain.handle('get-transparency-settings', () => {
    return {
      opacity: store.get('transparency.opacity', 0.92),
      blurEnabled: store.get('transparency.blurEnabled', false),
      clickThrough: store.get('transparency.clickThrough', false),
    };
  });

  ipcMain.handle('save-transparency-settings', (event, settings) => {
    store.set('transparency.opacity', settings.opacity);
    store.set('transparency.blurEnabled', settings.blurEnabled);
    store.set('transparency.clickThrough', settings.clickThrough);
    return { success: true };
  });

  ipcMain.on('set-window-opacity', (event, opacity) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      win.setOpacity(opacity);
    }
  });

  ipcMain.on('set-click-through', (event, enabled) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      win.setIgnoreMouseEvents(enabled, { forward: true });
    }
  });

  // Dynamic mouse events for interactive elements
  ipcMain.on('set-ignore-mouse-events', (event, ignore, options = { forward: true }) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      win.setIgnoreMouseEvents(ignore, options);
    }
  });

  // Register global shortcuts for opacity control
  globalShortcut.register('CommandOrControl+Up', () => {
    if (mainWindow) {
      const current = mainWindow.getOpacity();
      const newOpacity = Math.min(1.0, current + 0.05);
      mainWindow.setOpacity(newOpacity);
      store.set('transparency.opacity', newOpacity);
      mainWindow.webContents.send('opacity-changed', newOpacity);
    }
  });

  globalShortcut.register('CommandOrControl+Down', () => {
    if (mainWindow) {
      const current = mainWindow.getOpacity();
      const newOpacity = Math.max(0.2, current - 0.05);
      mainWindow.setOpacity(newOpacity);
      store.set('transparency.opacity', newOpacity);
      mainWindow.webContents.send('opacity-changed', newOpacity);
    }
  });

  // Toggle click-through mode with Ctrl+Shift+X
  globalShortcut.register('CommandOrControl+Shift+X', () => {
    if (mainWindow) {
      const current = store.get('transparency.clickThrough', false);
      const newState = !current;
      store.set('transparency.clickThrough', newState);
      mainWindow.setIgnoreMouseEvents(newState, { forward: true });
      mainWindow.webContents.send('click-through-toggled', newState);
    }
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});