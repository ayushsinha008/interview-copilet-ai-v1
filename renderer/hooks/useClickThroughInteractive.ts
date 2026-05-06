import { useEffect, useRef } from 'react';

/**
 * Hook to manage dynamic click-through behavior for interactive elements.
 * When click-through mode is enabled, the window ignores mouse events globally,
 * but this hook temporarily disables ignore mode when the mouse is over interactive elements.
 */
export function useClickThroughInteractive(isClickThroughEnabled: boolean) {
  const isOverInteractiveRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // List of selectors for interactive elements
  const interactiveSelectors = [
    'button',
    'input',
    'textarea',
    'select',
    '[role="button"]',
    '[contenteditable="true"]',
    '.interactive',
    '.non-draggable',
    '.draggable', // draggable region should also be interactive for dragging
  ];

  const selector = interactiveSelectors.join(', ');

  useEffect(() => {
    console.log(`useClickThroughInteractive: isClickThroughEnabled=${isClickThroughEnabled}`);
    if (!isClickThroughEnabled) {
      // Click-through is disabled, ensure window accepts mouse events
      console.log('Click-through disabled, enabling mouse events');
      if (window.electronAPI?.setIgnoreMouseEvents) {
        window.electronAPI.setIgnoreMouseEvents(false);
      }
      return;
    }

    // Click-through is enabled, set ignore mouse events globally
    console.log('Click-through enabled, setting ignore mouse events with forward: true');
    if (window.electronAPI?.setIgnoreMouseEvents) {
      window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
    }

    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      console.log('mouseenter on', target, 'matches?', target.matches(selector));
      // Check if target matches any interactive selector
      if (target.matches(selector)) {
        console.log('Over interactive element, disabling ignore mouse events');
        isOverInteractiveRef.current = true;
        // Clear any pending timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        // Disable ignore mouse events
        if (window.electronAPI?.setIgnoreMouseEvents) {
          window.electronAPI.setIgnoreMouseEvents(false);
        }
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      console.log('mouseleave from', target);
      if (target.matches(selector)) {
        isOverInteractiveRef.current = false;
        // Delay re-enabling ignore to avoid flickering when moving between interactive elements
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          // Only re-enable if still not over any interactive element
          if (!isOverInteractiveRef.current && isClickThroughEnabled) {
            console.log('No longer over interactive element, re-enabling ignore mouse events');
            if (window.electronAPI?.setIgnoreMouseEvents) {
              window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
            }
          }
          timeoutRef.current = null;
        }, 50);
      }
    };

    // Use event delegation on the document body
    document.body.addEventListener('mouseenter', handleMouseEnter, true);
    document.body.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      console.log('Cleaning up click-through hook');
      document.body.removeEventListener('mouseenter', handleMouseEnter, true);
      document.body.removeEventListener('mouseleave', handleMouseLeave, true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Reset ignore mouse events when hook unmounts or click-through disabled
      if (window.electronAPI?.setIgnoreMouseEvents) {
        window.electronAPI.setIgnoreMouseEvents(false);
      }
    };
  }, [isClickThroughEnabled, selector]);
}