import React from 'react';
import type { Slide, SlideElement, Position, Size } from '../../types';
import { Viewport } from '../Canvas/Viewport';
import { useDragAndDrop } from '../../hooks/useDrugAndDrop';
import styles from './Editor.module.css';

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
  const canvasScale = Math.min(width / slide.size.width, height / slide.size.height);

  const {
    dragState,
    resizeState,
    handleDragStart,
    handleDragEnd,
    handleResizeStart,
    handleResizeEnd,
    handleMouseMove
  } = useDragAndDrop({
    canvasScale,
    slideWidth: slide.size.width,
    slideHeight: slide.size.height,
    onUpdatePosition: onUpdateElementPosition,
    onUpdateSize: onUpdateElementSize
  });

  const handleElementDragStart = React.useCallback((
    e: React.MouseEvent,
    elementId: string
  ) => {
    const element = slide.elements.find(el => el.id === elementId);
    if (!element) return;

    handleDragStart(e, elementId, element.position);
  }, [slide.elements, handleDragStart]);

  const handleElementResizeStart = React.useCallback((
    e: React.MouseEvent,
    elementId: string,
    handle: any
  ) => {
    const element = slide.elements.find(el => el.id === elementId);
    if (!element) return;

    handleResizeStart(e, elementId, handle, element.size, element.position);
  }, [slide.elements, handleResizeStart]);

  const handleEditorClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onDeselectAll();
    }
  };
  
  return (
    <div
      onClick={handleEditorClick}
      onMouseMove={handleMouseMove}
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
          onDragStart={handleElementDragStart}
          onDragEnd={handleDragEnd}
          dragState={dragState}
          onResizeStart={handleElementResizeStart}
          onResizeEnd={handleResizeEnd}
          resizeState={resizeState}
        />
      </div>
    </div>
  );
};