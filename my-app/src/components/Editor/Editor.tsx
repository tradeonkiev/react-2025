import React from 'react';
import type { Slide, SlideElement, Position, Size, DragState, ResizeState, ResizeHandle } from '../../types';
import { Viewport } from '../Canvas/Viewport';
import styles from './Editor.module.css'

interface EditorProps {
  slide: Slide;
  onElementClick: (elementId: string, element: SlideElement) => void;
  width: number;
  height: number;
  selectedElementIds?: string[];
  onUpdateElementPosition: (elementId: string, position: Position) => void;
  onUpdateElementSize: (elementId: string, size: Size, position: Position) => void;
  onDeselectAll: () => void;
}

export const Editor = ({
  slide,
  onElementClick,
  width,
  height,
  selectedElementIds,
  onUpdateElementPosition,
  onUpdateElementSize,
  onDeselectAll
}: EditorProps) => {
  const [dragState, setDragState] = React.useState<DragState | null>(null);
  const [resizeState, setResizeState] = React.useState<ResizeState | null>(null);
  const canvasScale = Math.min(width / slide.size.width, height / slide.size.height);

  const handleDragStart = (e: React.MouseEvent, elementId: string) => {
    if (resizeState) return;
    
    const element = slide.elements.find(el => el.id === elementId);
    if (!element) return;

    setDragState({
      elementId,
      startX: e.clientX,
      startY: e.clientY,
      initialElementX: element.position.x,
      initialElementY: element.position.y
    });
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!dragState || resizeState) return;

    const deltaX = (e.clientX - dragState.startX) / canvasScale;
    const deltaY = (e.clientY - dragState.startY) / canvasScale;

    const newX = Math.max(0, Math.min(slide.size.width, dragState.initialElementX + deltaX));
    const newY = Math.max(0, Math.min(slide.size.height, dragState.initialElementY + deltaY));

    onUpdateElementPosition(dragState.elementId, { x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setDragState(null);
  };

  const handleResizeStart = (e: React.MouseEvent, elementId: string, handle: ResizeHandle) => {
    const element = slide.elements.find(el => el.id === elementId);
    if (!element) return;

    setResizeState({
      elementId,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: element.size.width,
      startHeight: element.size.height,
      startPosX: element.position.x,
      startPosY: element.position.y
    });
  };

  const handleResize = (e: React.MouseEvent) => {
    if (!resizeState) return;

    const deltaX = (e.clientX - resizeState.startX) / canvasScale;
    const deltaY = (e.clientY - resizeState.startY) / canvasScale;

    let newWidth = resizeState.startWidth;
    let newHeight = resizeState.startHeight;
    let newX = resizeState.startPosX;
    let newY = resizeState.startPosY;

    const minSize = 60;
    // const realDelta = Math.max(deltaX, deltaY);
    // const ratioSize = resizeState.startWidth / resizeState.startHeight;

    switch (resizeState.handle) {
      case 'nw':
        newWidth = Math.max(minSize, resizeState.startWidth - deltaX);
        newHeight = Math.max(minSize, resizeState.startHeight - deltaY);
        newX = resizeState.startPosX + (resizeState.startWidth - newWidth);
        newY = resizeState.startPosY + (resizeState.startHeight - newHeight);
        break;
      
      case 'ne':
        newWidth = Math.max(minSize, resizeState.startWidth + deltaX);
        newHeight = Math.max(minSize, resizeState.startHeight - deltaY);
        newY = resizeState.startPosY + (resizeState.startHeight - newHeight);
        break;
      
      case 'sw':
        newWidth = Math.max(minSize, resizeState.startWidth - deltaX);
        newHeight = Math.max(minSize, resizeState.startHeight + deltaY);
        newX = resizeState.startPosX + (resizeState.startWidth - newWidth);
        break;
      
      case 'se': 
        newWidth = Math.max(minSize, resizeState.startWidth + deltaX);
        newHeight = Math.max(minSize, resizeState.startHeight + deltaY);
        break;
      
      case 'n':
        newHeight = Math.max(minSize, resizeState.startHeight - deltaY);
        newY = resizeState.startPosY + (resizeState.startHeight - newHeight);
        break;
        
      case 's': 
        newHeight = Math.max(minSize, resizeState.startHeight + deltaY);
        break;

      case 'w': 
        newWidth = Math.max(minSize, resizeState.startWidth - deltaX);
        newX = resizeState.startPosX + (resizeState.startWidth - newWidth);
        break

      case 'e': 
        newWidth = Math.max(minSize, resizeState.startWidth + deltaX);
        break
    }

    onUpdateElementSize(
      resizeState.elementId,
      { width: newWidth, height: newHeight },
      { x: newX, y: newY }
    );
  };

  const handleResizeEnd = () => {
    setResizeState(null);
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onDeselectAll();
    }
  };
  
  return (
    <div
      onClick={handleEditorClick}
      onMouseMove={(e) => {
        handleDrag(e);
        handleResize(e);
      }}
      className={styles['editor-container']}
      style={{
        cursor: resizeState ? 'default' : dragState ? 'grabbing' : 'default'
      }}
    >
      <div className={styles['wrapper']}>
        <Viewport
          slide={slide}
          width={width}
          height={height}
          selectedElementIds={selectedElementIds}
          onElementClick={onElementClick}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          dragState={dragState}
          onResizeStart={handleResizeStart}
          onResizeEnd={handleResizeEnd}
          resizeState={resizeState}
        />
      </div>
    </div>
  );
};