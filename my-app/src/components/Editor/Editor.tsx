import React from 'react';
import type { Slide, SlideElement, Position, DragState } from '../../types';
import { Viewport } from '../Canvas/Viewport';
import styles from './Editor.module.css'

interface EditorProps {
  slide: Slide;
  onElementClick: (elementId: string, element: SlideElement) => void;
  width: number;
  height: number;
  selectedElementIds?: string[];
  onUpdateElementPosition: (elementId: string, position: Position) => void;
  onDeselectAll: () => void;
}

export const Editor = (
  { 
    slide, 
    onElementClick, 
    width, 
    height, 
    selectedElementIds,
    onUpdateElementPosition,
    onDeselectAll
  }: EditorProps
) => {
  const [dragState, setDragState] = React.useState<DragState | null>(null);
  const canvasScale = Math.min(width / slide.size.width, height / slide.size.height);

  const handleDragStart = (e: React.MouseEvent, elementId: string) => {
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
    if (!dragState) return;

    const deltaX = (e.clientX - dragState.startX) / canvasScale;
    const deltaY = (e.clientY - dragState.startY) / canvasScale;

    const newX = Math.max(0, Math.min(slide.size.width, dragState.initialElementX + deltaX));
    const newY = Math.max(0, Math.min(slide.size.height, dragState.initialElementY + deltaY));

    onUpdateElementPosition(dragState.elementId, { x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setDragState(null);
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    console.log('penis');
    if (e.target === e.currentTarget) {
      onDeselectAll();
    }
  };

  return (
    <div 
      onClick={handleEditorClick} 
      onMouseMove={handleDrag}  // ✅ Добавили
      className={styles['editor-container']}
      style={{
        cursor: dragState ? 'grabbing' : 'default'
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
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          dragState={dragState}
        />
      </div>
    </div>
  );
};  