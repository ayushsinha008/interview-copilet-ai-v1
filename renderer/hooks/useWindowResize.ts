import { useState, useEffect, useCallback, useRef } from 'react';

type ResizeDirection = 
  | 'top' 
  | 'bottom' 
  | 'left' 
  | 'right' 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right';

interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SizeLimits {
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  defaultWidth: number;
  defaultHeight: number;
}

const useWindowResize = () => {
  const [isResizing, setIsResizing] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<ResizeDirection | null>(null);
  const [sizeLimits, setSizeLimits] = useState<SizeLimits>({
    minWidth: 320,
    minHeight: 500,
    maxWidth: 900,
    maxHeight: 1200,
    defaultWidth: 380,
    defaultHeight: 700,
  });
  const [currentBounds, setCurrentBounds] = useState<WindowBounds>({
    x: 100,
    y: 100,
    width: 380,
    height: 700,
  });

  const startPosRef = useRef({ x: 0, y: 0 });
  const startBoundsRef = useRef<WindowBounds | null>(null);

  // Load size limits on mount
  useEffect(() => {
    const loadSizeLimits = async () => {
      try {
        if (window.electronAPI?.getWindowSizeLimits) {
          const limits = await window.electronAPI.getWindowSizeLimits();
          setSizeLimits(limits);
        }
      } catch (err) {
        console.error('Failed to load window size limits:', err);
      }
    };

    const loadCurrentBounds = async () => {
      try {
        if (window.electronAPI?.getWindowBounds) {
          const bounds = await window.electronAPI.getWindowBounds();
          if (bounds) {
            setCurrentBounds(bounds);
          }
        }
      } catch (err) {
        console.error('Failed to load window bounds:', err);
      }
    };

    loadSizeLimits();
    loadCurrentBounds();
  }, []);

  const clampSize = useCallback((width: number, height: number) => {
    return {
      width: Math.max(sizeLimits.minWidth, Math.min(sizeLimits.maxWidth, width)),
      height: Math.max(sizeLimits.minHeight, Math.min(sizeLimits.maxHeight, height)),
    };
  }, [sizeLimits]);

  const handleResizeStart = useCallback((direction: ResizeDirection, startX: number, startY: number) => {
    setIsResizing(true);
    setCurrentDirection(direction);
    startPosRef.current = { x: startX, y: startY };
    startBoundsRef.current = { ...currentBounds };
  }, [currentBounds]);

  const handleResize = useCallback((deltaX: number, deltaY: number) => {
    if (!currentDirection || !startBoundsRef.current) return;

    const { width: startWidth, height: startHeight, x: startX, y: startY } = startBoundsRef.current;
    let newWidth = startWidth;
    let newHeight = startHeight;
    let newX = startX;
    let newY = startY;

    switch (currentDirection) {
      case 'right':
        newWidth = startWidth + deltaX;
        break;
      case 'left':
        newWidth = startWidth - deltaX;
        newX = startX + deltaX;
        break;
      case 'bottom':
        newHeight = startHeight + deltaY;
        break;
      case 'top':
        newHeight = startHeight - deltaY;
        newY = startY + deltaY;
        break;
      case 'bottom-right':
        newWidth = startWidth + deltaX;
        newHeight = startHeight + deltaY;
        break;
      case 'bottom-left':
        newWidth = startWidth - deltaX;
        newHeight = startHeight + deltaY;
        newX = startX + deltaX;
        break;
      case 'top-right':
        newWidth = startWidth + deltaX;
        newHeight = startHeight - deltaY;
        newY = startY + deltaY;
        break;
      case 'top-left':
        newWidth = startWidth - deltaX;
        newHeight = startHeight - deltaY;
        newX = startX + deltaX;
        newY = startY + deltaY;
        break;
    }

    // Apply size constraints
    const clamped = clampSize(newWidth, newHeight);
    
    // Adjust position for left/top resizing to maintain visual consistency
    if (currentDirection.includes('left')) {
      const widthDiff = newWidth - clamped.width;
      newX += widthDiff;
    }
    if (currentDirection.includes('top')) {
      const heightDiff = newHeight - clamped.height;
      newY += heightDiff;
    }

    // Update window bounds via IPC
    if (window.electronAPI?.setWindowBounds) {
      window.electronAPI.setWindowBounds({
        x: Math.round(newX),
        y: Math.round(newY),
        width: Math.round(clamped.width),
        height: Math.round(clamped.height),
      });
    }

    // Update local state
    setCurrentBounds({
      x: Math.round(newX),
      y: Math.round(newY),
      width: Math.round(clamped.width),
      height: Math.round(clamped.height),
    });
  }, [currentDirection, clampSize]);

  const handleResizeEnd = useCallback(() => {
    if (isResizing && currentBounds) {
      // Save final bounds
      if (window.electronAPI?.saveWindowBounds) {
        window.electronAPI.saveWindowBounds(currentBounds);
      }
    }
    setIsResizing(false);
    setCurrentDirection(null);
    startBoundsRef.current = null;
  }, [isResizing, currentBounds]);

  // Global mouse event listeners
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;
      handleResize(deltaX, deltaY);
    };

    const handleMouseUp = () => {
      handleResizeEnd();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleResize, handleResizeEnd]);

  const resetToDefaultSize = useCallback(() => {
    const defaultBounds = {
      x: currentBounds.x,
      y: currentBounds.y,
      width: sizeLimits.defaultWidth,
      height: sizeLimits.defaultHeight,
    };

    if (window.electronAPI?.setWindowBounds) {
      window.electronAPI.setWindowBounds(defaultBounds);
    }
    setCurrentBounds(defaultBounds);
  }, [currentBounds.x, currentBounds.y, sizeLimits]);

  return {
    isResizing,
    currentDirection,
    currentBounds,
    sizeLimits,
    handleResizeStart,
    handleResize,
    handleResizeEnd,
    resetToDefaultSize,
  };
};

export default useWindowResize;