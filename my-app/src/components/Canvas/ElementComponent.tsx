import React, { useRef } from "react";
import type { SlideElement, ResizeHandle, ResizeState, Position, Size } from '../../types';
import styles from './ElementComponents.module.css'

export const ElementComponent = ({
  element,
  onClick,
  canvasScale,
  isSelected,
  onDragStart,
  isDragging,
  onResizeStart,
  resizeState,
  tempPosition,
  tempSize
}: {
  element: SlideElement;
  onClick: (e: React.MouseEvent) => void;
  canvasScale: number;
  isSelected: boolean;
  onDragStart: (e: React.MouseEvent, elementId: string) => void;
  isDragging: boolean;
  onResizeStart: (e: React.MouseEvent, elementId: string, handle: ResizeHandle) => void;
  resizeState: ResizeState | null;
  tempPosition?: Position;
  tempSize?: { size: Size; position: Position };
}) => {
  const isResizing = resizeState?.elementId === element.id;
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);

  const displayPosition = tempPosition || element.position;
  const displaySize = tempSize?.size || element.size;
  const displaySizePosition = tempSize?.position || element.position;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
    
    if (e.ctrlKey || e.metaKey) {
      onClick(e);
      return;
    }
    
    if (!isSelected) {
      onClick(e);
    }
    
    onDragStart(e, element.id);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    if (!isSelected) {
      onClick(e);
    }
    
    onResizeStart(e, element.id, handle);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className={styles['test']}
      style={{
        position: 'absolute',
        left: (tempSize ? displaySizePosition.x : displayPosition.x) * canvasScale,
        top: (tempSize ? displaySizePosition.y : displayPosition.y) * canvasScale,
        width: displaySize.width * canvasScale,
        height: displaySize.height * canvasScale,
        cursor: isDragging ? 'grabbing' : isResizing ? 'default' : 'grab',
        transition: isDragging || isResizing ? 'none' : 'box-shadow 0.2s',
        boxShadow: isSelected || isDragging
          ? '0 0 0 2px #1783FF' 
          : 'none',
        zIndex: isDragging || isResizing || isSelected ? 1000 : 1
      }}
    >
      {element.type === 'text' ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            color: element.color,
            fontFamily: element.fontFamily,
            fontSize: element.fontSize * canvasScale,
            width: '100%',
            height: '100%',
            userSelect: 'none',
          }}
        >
          {element.content}
        </div>
      ) : (
        <img
          src={element.src}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
          draggable={false}
        />
      )}
      {(isSelected || isDragging) && (
        <>
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
            className={styles['resize-handler']}
            style={{
              top: -4,
              left: -4,
              cursor: 'nw-resize',
            }}
          />
          
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
            className={styles['resize-handler']}
            style={{
              top: -4,
              right: -4,
              cursor: 'ne-resize',
            }}
          />
          
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
            className={styles['resize-handler']}
            style={{
              bottom: -4,
              left: -4,
              cursor: 'sw-resize',
            }}
          />
          
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
            className={styles['resize-handler']}
            style={{
              bottom: -4,
              right: -4,
              cursor: 'se-resize',
            }}
          />

          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
            className={styles['resize-handler']}
            style={{
              top: -4,
              left: '50%',
              transform: 'translateX(-50%)',
              cursor: 'n-resize',
            }}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 's')}
            className={styles['resize-handler']}
            style={{
              bottom: -4,
              left: '50%',
              transform: 'translateX(-50%)',
              cursor: 's-resize',
            }}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
            className={styles['resize-handler']}
            style={{
              top: '50%',
              left: -4,
              transform: 'translateY(-50%)',
              cursor: 'w-resize',
            }}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
            className={styles['resize-handler']}
            style={{
              top: '50%',
              right: -4,
              transform: 'translateY(-50%)',
              cursor: 'e-resize',
            }}
          />
        </>
      )}
    </div>
  );
};