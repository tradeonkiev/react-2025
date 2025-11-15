import { useState, useCallback, useRef } from 'react';

export function useSlideDragDrop(
  selectedSlideIds: string[],
  slides: Array<{ id: string }>,
  onReorder: (fromIndices: number[], toIndex: number) => void
) {
  const [draggedIndices, setDraggedIndices] = useState<number[]>([]);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const draggedIndicesRef = useRef<number[]>([]);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    const slideId = slides[index].id;
    
    let indicesToDrag: number[];
    
    if (selectedSlideIds.length > 1 && selectedSlideIds.includes(slideId)) {
      indicesToDrag = selectedSlideIds
        .map(id => slides.findIndex(s => s.id === id))
        .filter(idx => idx !== -1)
        .sort((a, b) => a - b);
    } else {
      indicesToDrag = [index];
    }
    
    draggedIndicesRef.current = indicesToDrag;
    setDraggedIndices(indicesToDrag);
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', JSON.stringify(indicesToDrag));
    
    console.log(`start: ${indicesToDrag}`);
  }, [selectedSlideIds, slides]);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndicesRef.current.length > 0 && !draggedIndicesRef.current.includes(index)) {
      setDropTargetIndex(index);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    const fromIndices = draggedIndicesRef.current;
    
    if (fromIndices.length > 0 && !fromIndices.includes(index)) {
      console.log(`move:`, fromIndices, `=>`, index);
      onReorder(fromIndices, index);
    }
    
    setDraggedIndices([]);
    setDropTargetIndex(null);
    draggedIndicesRef.current = [];
  }, [onReorder]);

  const handleDragEnd = useCallback(() => {
    console.log('end');
    setDraggedIndices([]);
    setDropTargetIndex(null);
    draggedIndicesRef.current = [];
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (e.currentTarget === e.target) {
      setDropTargetIndex(null);
    }
  }, []);

  return {
    draggedIndices,
    dropTargetIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleDragLeave,
    isDragging: (index: number) => draggedIndices.includes(index),
    isDropTarget: (index: number) => dropTargetIndex === index,
  };
}