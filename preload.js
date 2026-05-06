const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer to use the ipcRenderer without exposing
// the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),

  // AI generation
  generateAnswer: (question, context) => ipcRenderer.invoke('generate-answer', question, context),

  // Window controls
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),

  // Window resize controls
  resizeWindow: (width, height) => ipcRenderer.send('resize-window', { width, height }),
  setWindowBounds: (bounds) => ipcRenderer.send('set-window-bounds', bounds),
  getWindowBounds: () => ipcRenderer.invoke('get-window-bounds'),
  saveWindowBounds: (bounds) => ipcRenderer.invoke('save-window-bounds', bounds),
  getWindowSizeLimits: () => ipcRenderer.invoke('get-window-size-limits'),

  // Transparency controls
  getTransparencySettings: () => ipcRenderer.invoke('get-transparency-settings'),
  saveTransparencySettings: (settings) => ipcRenderer.invoke('save-transparency-settings', settings),
  setWindowOpacity: (opacity) => ipcRenderer.send('set-window-opacity', opacity),
  setClickThrough: (enabled) => ipcRenderer.send('set-click-through', enabled),
  setIgnoreMouseEvents: (ignore, options) => ipcRenderer.send('set-ignore-mouse-events', ignore, options),
  onOpacityChanged: (callback) => ipcRenderer.on('opacity-changed', callback),
  onClickThroughToggled: (callback) => ipcRenderer.on('click-through-toggled', callback),

  // Listening toggle
  onToggleListening: (callback) => ipcRenderer.on('toggle-listening', callback),
  removeToggleListeningListener: () => ipcRenderer.removeAllListeners('toggle-listening'),
});