import React from 'react';
import { Viewport } from '../Canvas/Viewport';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectElement,
  deselectAll,
  updateElementPosition,
  updateElementSize,
  updateGroupPositions
} from '../../store/editorSlice';
import styles from './Editor.module.css';

export const Editor = () => {
  const dispatch = useAppDispatch();
  const presentation = useAppSelector((state) => state.history.present);
  
  const currentSlideId = presentation.selection.slideIds[0];
  const currentSlide = presentation.slides.find(slide => slide.id === currentSlideId) || presentation.slides[0];
  const selectedElementIds = presentation.selection.elementIds;

  const width = 1280;
  const height = 720;
  const canvasScale = Math.min(width / currentSlide.size.width, height / currentSlide.size.height);

  const handleUpdateElementPosition = (elementId: string, position: { x: number; y: number }) => {
    dispatch(updateElementPosition({ slideId: currentSlideId, elementId, position }));
  };

  const handleUpdateElementSize = (elementId: string, size: { width: number; height: number }, position: { x: number; y: number }) => {
    dispatch(updateElementSize({ slideId: currentSlideId, elementId, size, position }));
  };

  const handleUpdateGroupPositions = (updates: Array<{ elementId: string; position: { x: number; y: number } }>) => {
    dispatch(updateGroupPositions({ slideId: currentSlideId, updates }));
  };

  const {
    dragState,
    groupDragState,
    resizeState,
    handleDragStart,
    handleDragEnd,
    handleResizeStart,
    handleResizeEnd,
    handleMouseMove
  } = useDragAndDrop({
    canvasScale,
    slideWidth: currentSlide.size.width,
    slideHeight: currentSlide.size.height,
    selectedElementIds,
    elements: currentSlide.elements,
    onUpdatePosition: handleUpdateElementPosition,
    onUpdateSize: handleUpdateElementSize,
    onUpdateGroupPositions: handleUpdateGroupPositions
  });

  const handleElementDragStart = React.useCallback((
    e: React.MouseEvent,
    elementId: string
  ) => {
    const element = currentSlide.elements.find(el => el.id === elementId);
    if (!element) return;

    handleDragStart(e, elementId, element.position);
  }, [currentSlide.elements, handleDragStart]);

  const handleElementResizeStart = React.useCallback((
    e: React.MouseEvent,
    elementId: string,
    handle: any
  ) => {
    const element = currentSlide.elements.find(el => el.id === elementId);
    if (!element) return;

    handleResizeStart(e, elementId, handle, element.size, element.position);
  }, [currentSlide.elements, handleResizeStart]);

  const handleElementClick = (elementId: string, ctrlKey: boolean) => {
    dispatch(selectElement({ elementId, addToSelection: ctrlKey }));
  };

  const handleDeselectAll = () => {
    dispatch(deselectAll());
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleDeselectAll();
    }
  };
  
  return (
    <div
      onClick={handleEditorClick}
      onMouseMove={handleMouseMove}
      className={styles['editor-container']}
      style={{
        cursor: resizeState ? 'default' : (dragState || groupDragState) ? 'grabbing' : 'default'
      }}
    >
      <div className={styles['wrapper']}>
        <Viewport
          slide={currentSlide}
          width={width}
          height={height}
          selectedElementIds={selectedElementIds}
          onElementClick={handleElementClick}
          onDragStart={handleElementDragStart}
          onDragEnd={handleDragEnd}
          dragState={dragState}
          groupDragState={groupDragState}
          onResizeStart={handleElementResizeStart}
          onResizeEnd={handleResizeEnd}
          resizeState={resizeState}
        />
      </div>
    </div>
  );
};