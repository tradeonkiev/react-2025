import { useState, useCallback, useRef } from 'react';
import type { DragState, ResizeState, ResizeHandle, Position, Size, GroupDragState, SlideElement } from '../types';

interface UseDragAndDropProps {
  canvasScale: number;
  slideWidth: number;
  slideHeight: number;
  selectedElementIds: string[];
  elements: SlideElement[];
  onUpdatePosition: (elementId: string, position: Position) => void;
  onUpdateSize: (elementId: string, size: Size, position: Position) => void;
  onUpdateGroupPositions: (updates: Array<{ elementId: string; position: Position }>) => void;
}

export const useDragAndDrop = ({
  canvasScale,
  slideWidth,
  slideHeight,
  selectedElementIds,
  elements,
  onUpdatePosition,
  onUpdateSize,
  onUpdateGroupPositions
}: UseDragAndDropProps) => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [groupDragState, setGroupDragState] = useState<GroupDragState | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);

  const isDraggingRef = useRef(false);
  const isGroupDraggingRef = useRef(false);
  const isResizingRef = useRef(false);

  const handleDragStart = useCallback((
    e: React.MouseEvent,
    elementId: string,
    initialPosition: Position
  ) => {
    if (isResizingRef.current) return;
    
    if (selectedElementIds.length > 1 && selectedElementIds.includes(elementId)) {
      isGroupDraggingRef.current = true;
      
      const initialPositions = new Map<string, Position>();
      selectedElementIds.forEach(id => {
        const element = elements.find(el => el.id === id);
        if (element) {
          initialPositions.set(id, { ...element.position });
        }
      });
      
      setGroupDragState({
        elementIds: selectedElementIds,
        startX: e.clientX,
        startY: e.clientY,
        initialPositions
      });
    } else {
      isDraggingRef.current = true;
      setDragState({
        elementId,
        startX: e.clientX,
        startY: e.clientY,
        initialElementX: initialPosition.x,
        initialElementY: initialPosition.y
      });
    }
  }, [selectedElementIds, elements]);

  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (groupDragState && isGroupDraggingRef.current) {
      const deltaX = (e.clientX - groupDragState.startX) / canvasScale;
      const deltaY = (e.clientY - groupDragState.startY) / canvasScale;

      const updates = Array.from(groupDragState.initialPositions.entries()).map(([elementId, initialPos]) => {
        const newX = Math.max(0, Math.min(slideWidth, initialPos.x + deltaX));
        const newY = Math.max(0, Math.min(slideHeight, initialPos.y + deltaY));
        
        return {
          elementId,
          position: { x: newX, y: newY }
        };
      });

      onUpdateGroupPositions(updates);
      
    } else if (dragState && isDraggingRef.current) {
      const deltaX = (e.clientX - dragState.startX) / canvasScale;
      const deltaY = (e.clientY - dragState.startY) / canvasScale;

      const newX = Math.max(0, Math.min(slideWidth, dragState.initialElementX + deltaX));
      const newY = Math.max(0, Math.min(slideHeight, dragState.initialElementY + deltaY));

      onUpdatePosition(dragState.elementId, { x: newX, y: newY });
    }
  }, [dragState, groupDragState, canvasScale, slideWidth, slideHeight, onUpdatePosition, onUpdateGroupPositions]);

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    isGroupDraggingRef.current = false;
    setDragState(null);
    setGroupDragState(null);
  }, []);

  const handleResizeStart = useCallback((
    e: React.MouseEvent,
    elementId: string,
    handle: ResizeHandle,
    currentSize: Size,
    currentPosition: Position
  ) => {
    isResizingRef.current = true;
    setResizeState({
      elementId,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: currentSize.width,
      startHeight: currentSize.height,
      startPosX: currentPosition.x,
      startPosY: currentPosition.y
    });
  }, []);

  const handleResize = useCallback((e: React.MouseEvent) => {
    if (!resizeState || !isResizingRef.current) return;

    const deltaX = (e.clientX - resizeState.startX) / canvasScale;
    const deltaY = (e.clientY - resizeState.startY) / canvasScale;

    const minSize = 60;
    let newWidth = resizeState.startWidth;
    let newHeight = resizeState.startHeight;
    let newX = resizeState.startPosX;
    let newY = resizeState.startPosY;

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
        break;
      
      case 'e':
        newWidth = Math.max(minSize, resizeState.startWidth + deltaX);
        break;
    }

    onUpdateSize(
      resizeState.elementId,
      { width: newWidth, height: newHeight },
      { x: newX, y: newY }
    );
  }, [resizeState, canvasScale, onUpdateSize]);

  const handleResizeEnd = useCallback(() => {
    isResizingRef.current = false;
    setResizeState(null);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDraggingRef.current || isGroupDraggingRef.current) {
      handleDrag(e);
    } else if (isResizingRef.current) {
      handleResize(e);
    }
  }, [handleDrag, handleResize]);

  return {
    dragState,
    groupDragState,
    resizeState,
    isDragging: isDraggingRef.current,
    isGroupDragging: isGroupDraggingRef.current,
    isResizing: isResizingRef.current,
    handleDragStart,
    handleDragEnd,
    handleResizeStart,
    handleResizeEnd,
    handleMouseMove
  };
};