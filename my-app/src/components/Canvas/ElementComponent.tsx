import React from "react";
import type { SlideElement, ResizeHandle, ResizeState } from '../../types';
import styles from './ElementComponents.module.css'

export const ElementComponent = ({
  element,
  onClick,
  canvasScale,
  isSelected,
  onDragStart,
  isDragging,
  onResizeStart,
  resizeState
}: {
  element: SlideElement;
  onClick: (e: React.MouseEvent) => void;
  canvasScale: number;
  isSelected: boolean;
  onDragStart: (e: React.MouseEvent, elementId: string) => void;
  isDragging: boolean;
  onResizeStart: (e: React.MouseEvent, elementId: string, handle: ResizeHandle) => void;
  resizeState: ResizeState | null;
}) => {
  const isResizing = resizeState?.elementId === element.id;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(e);
    if (!e.ctrlKey && !e.metaKey) {
      onDragStart(e, element.id);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    onClick(e);
    onResizeStart(e, element.id, handle);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className={styles['test']}
      style={{
        position: 'absolute',
        left: element.position.x * canvasScale,
        top: element.position.y * canvasScale,
        width: element.size.width * canvasScale,
        height: element.size.height * canvasScale,
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
            objectFit: 'cover',
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