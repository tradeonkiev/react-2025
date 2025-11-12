import { useState, useCallback, useRef } from 'react';

export function useSlideDragDrop(
  onReorder: (fromIndex: number, toIndex: number) => void
) {

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const draggedIndexRef = useRef<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {

    draggedIndexRef.current = index;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
    
    console.log(`🎯 Начало перетаскивания: индекс ${index}`);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndexRef.current !== null && draggedIndexRef.current !== index) {
      setDropTargetIndex(index);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    const fromIndex = draggedIndexRef.current;
    
    if (fromIndex !== null && fromIndex !== index) {
      console.log(`✅ Перемещение: ${fromIndex} → ${index}`);
      onReorder(fromIndex, index);
    }
    setDraggedIndex(null);
    setDropTargetIndex(null);
    draggedIndexRef.current = null;
  }, [onReorder]);

  const handleDragEnd = useCallback(() => {
    console.log('🏁 Завершение перетаскивания');
    setDraggedIndex(null);
    setDropTargetIndex(null);
    draggedIndexRef.current = null;
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (e.currentTarget === e.target) {
      setDropTargetIndex(null);
    }
  }, []);

  return {
    draggedIndex,
    dropTargetIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleDragLeave,
    isDragging: (index: number) => draggedIndex === index,
    isDropTarget: (index: number) => dropTargetIndex === index,
  };
}