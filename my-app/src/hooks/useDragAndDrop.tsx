// src/hooks/useDragAndDrop.tsx
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

  const [tempPositions, setTempPositions] = useState<Map<string, Position>>(new Map());
  const [tempSize, setTempSize] = useState<{ elementId: string; size: Size; position: Position } | null>(null);

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

      const newTempPositions = new Map<string, Position>();
      
      groupDragState.initialPositions.forEach((initialPos, elementId) => {
        const newX = initialPos.x + deltaX;
        const newY = initialPos.y + deltaY;
        newTempPositions.set(elementId, { x: newX, y: newY });
      });

      setTempPositions(newTempPositions);
      
    } else if (dragState && isDraggingRef.current) {
      const deltaX = (e.clientX - dragState.startX) / canvasScale;
      const deltaY = (e.clientY - dragState.startY) / canvasScale;

      const newX = dragState.initialElementX + deltaX;
      const newY = dragState.initialElementY + deltaY;

      const newTempPositions = new Map<string, Position>();
      newTempPositions.set(dragState.elementId, { x: newX, y: newY });
      setTempPositions(newTempPositions);
    }
  }, [dragState, groupDragState, canvasScale]);

  const handleDragEnd = useCallback(() => {
    if (isGroupDraggingRef.current && groupDragState) {
      const updates = Array.from(tempPositions.entries()).map(([elementId, position]) => ({
        elementId,
        position
      }));
      
      if (updates.length > 0) {
        onUpdateGroupPositions(updates);
      }
    } else if (isDraggingRef.current && dragState) {
      const finalPosition = tempPositions.get(dragState.elementId);
      if (finalPosition) {
        onUpdatePosition(dragState.elementId, finalPosition);
      }
    }

    isDraggingRef.current = false;
    isGroupDraggingRef.current = false;
    setDragState(null);
    setGroupDragState(null);
    setTempPositions(new Map());
  }, [dragState, groupDragState, tempPositions, onUpdatePosition, onUpdateGroupPositions]);

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

    setTempSize({
      elementId: resizeState.elementId,
      size: { width: newWidth, height: newHeight },
      position: { x: newX, y: newY }
    });
  }, [resizeState, canvasScale]);

  const handleResizeEnd = useCallback(() => {
    if (isResizingRef.current && tempSize) {
      onUpdateSize(tempSize.elementId, tempSize.size, tempSize.position);
    }

    isResizingRef.current = false;
    setResizeState(null);
    setTempSize(null);
  }, [tempSize, onUpdateSize]);

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
    tempPositions,
    tempSize,
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