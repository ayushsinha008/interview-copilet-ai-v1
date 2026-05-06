import React from 'react';
import { cn } from '../lib/utils';
import useWindowResize from '../hooks/useWindowResize';

type ResizeDirection =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

interface ResizeHandlesProps {
  className?: string;
  handleSize?: number;
  enabled?: boolean;
}

const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  className,
  handleSize = 8,
  enabled = true,
}) => {
  const { handleResizeStart } = useWindowResize();

  const handleMouseDown = (e: React.MouseEvent, direction: ResizeDirection) => {
    if (!enabled) return;

    e.preventDefault();
    e.stopPropagation();
    handleResizeStart(direction, e.clientX, e.clientY);
  };

  const getCursorStyle = (direction: ResizeDirection) => {
    switch (direction) {
      case 'top':
      case 'bottom':
        return 'ns-resize';
      case 'left':
      case 'right':
        return 'ew-resize';
      case 'top-left':
      case 'bottom-right':
        return 'nwse-resize';
      case 'top-right':
      case 'bottom-left':
        return 'nesw-resize';
      default:
        return 'default';
    }
  };

  const handleStyle = {
    width: handleSize,
    height: handleSize,
  };

  const edgeHandleStyle = {
    width: handleSize * 2,
    height: handleSize * 2,
  };

  if (!enabled) return null;

  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      {/* Top edge */}
      <div
        className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-blue-400/20 pointer-events-auto"
        style={{ height: handleSize }}
        onMouseDown={(e) => handleMouseDown(e, 'top')}
      />

      {/* Bottom edge */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-blue-400/20 pointer-events-auto"
        style={{ height: handleSize }}
        onMouseDown={(e) => handleMouseDown(e, 'bottom')}
      />

      {/* Left edge */}
      <div
        className="absolute top-0 left-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-400/20 pointer-events-auto"
        style={{ width: handleSize }}
        onMouseDown={(e) => handleMouseDown(e, 'left')}
      />

      {/* Right edge */}
      <div
        className="absolute top-0 right-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-400/20 pointer-events-auto"
        style={{ width: handleSize }}
        onMouseDown={(e) => handleMouseDown(e, 'right')}
      />

      {/* Top-left corner */}
      <div
        className="absolute top-0 left-0 cursor-nwse-resize hover:bg-blue-400/30 pointer-events-auto"
        style={edgeHandleStyle}
        onMouseDown={(e) => handleMouseDown(e, 'top-left')}
      />

      {/* Top-right corner */}
      <div
        className="absolute top-0 right-0 cursor-nesw-resize hover:bg-blue-400/30 pointer-events-auto"
        style={edgeHandleStyle}
        onMouseDown={(e) => handleMouseDown(e, 'top-right')}
      />

      {/* Bottom-left corner */}
      <div
        className="absolute bottom-0 left-0 cursor-nesw-resize hover:bg-blue-400/30 pointer-events-auto"
        style={edgeHandleStyle}
        onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
      />

      {/* Bottom-right corner */}
      <div
        className="absolute bottom-0 right-0 cursor-nwse-resize hover:bg-blue-400/30 pointer-events-auto"
        style={edgeHandleStyle}
        onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
      />
    </div>
  );
};

export default ResizeHandles;