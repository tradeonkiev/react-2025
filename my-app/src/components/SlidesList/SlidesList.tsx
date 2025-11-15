import clsx from 'clsx';
import React from 'react';
import { Grid, Plus, Trash2 } from "lucide-react";
import type { Slide } from '../../types';
import { Viewport } from '../Canvas/Viewport';
import { useSlideDragDrop } from '../../hooks/useSlideDragDrop';
import styles from './SlideList.module.css';

interface SlidesListProps {
  slides: Slide[];
  selectedSlideIds: string[];
  onSlideClick: (slideId: string, index: number, ctrlKey: boolean) => void;
  onAddSlide: () => void;
  onDeleteSlide: (slideId: string, index: number) => void;
  onReorderSlides: (fromIndices: number[], toIndex: number) => void;
}

const SlidePreview = ({ 
  slide, 
  index, 
  isActive, 
  onClick, 
  onAddSlide, 
  onDeleteSlide,
  dragHandlers,
  isDragging,
  isDropTarget
}: {
  slide: Slide;
  index: number;
  isActive: boolean;
  onClick: (ctrlKey: boolean) => void;
  onAddSlide: () => void;
  onDeleteSlide: () => void;
  dragHandlers: {
    onDragStart: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragEnd: () => void;
    onDragLeave: (e: React.DragEvent) => void;
  };
  isDragging: boolean;
  isDropTarget: boolean;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    onClick(e.ctrlKey || e.metaKey);
  };

  return (
    <div
      draggable
      {...dragHandlers}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        styles['thumbnail-slide'],
        { 
          [styles['active']]: isActive,
          [styles['dragging']]: isDragging,
          [styles['drop-target']]: isDropTarget
        }
      )}
    >
      <div className={styles['protective-film']}></div>
      <Viewport 
        slide={slide}
        width={264}
        height={148.5}
        selectedElementIds={[]}
        onElementClick={() => {}}
        onDragStart={() => {}}
        onDragEnd={() => {}}
        onResizeEnd={() => {}}
        onResizeStart={() => {}}
        resizeState={null}
        dragState={null}
      />
      
      <div className={styles['label']}>
        {(index + 1).toString().padStart(2, '0')}
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onAddSlide();
        }}
        className={clsx(
          styles['add-slide'],
          { [styles['active']]: isHovered }
        )}
      >
        <Plus className={styles['add-slide-icon']}/>
      </button>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDeleteSlide();
        }}
        className={clsx(
          styles['delete-slide'],
          { [styles['active']]: isActive || isHovered }
        )}
      >
        <Trash2 className={styles['delete-slide-icon']}/>
      </button>
    </div>
  );
};

export const SlidesList = ({
  slides, 
  selectedSlideIds, 
  onSlideClick,
  onAddSlide,
  onDeleteSlide,
  onReorderSlides
}: SlidesListProps) => {
  const dragDrop = useSlideDragDrop(selectedSlideIds, slides, onReorderSlides);

  const currentSlideIndex = slides.findIndex(s => selectedSlideIds.includes(s.id));

  return (
    <div className={styles['thumbnail-wrapper']}>
      <div className={styles['page-number']}>
        <div className={styles['icon-side']}>
          <Grid strokeWidth={1} />
        </div>
        <div className={styles['page-number-text']}>
          {selectedSlideIds.length > 1 
            ? `${selectedSlideIds.length} выбрано`
            : `${currentSlideIndex + 1} / ${slides.length}`
          }
        </div>
      </div>
      
      <div className={styles['thumbnail-list']}>
        {slides.map((slide, index) => (
          <SlidePreview
            key={slide.id}
            slide={slide}
            index={index}
            isActive={selectedSlideIds.includes(slide.id)}
            onClick={(ctrlKey) => onSlideClick(slide.id, index, ctrlKey)}
            onAddSlide={onAddSlide}
            onDeleteSlide={() => onDeleteSlide(slide.id, index)}
            dragHandlers={{
              onDragStart: (e) => dragDrop.handleDragStart(e, index),
              onDragOver: (e) => dragDrop.handleDragOver(e, index),
              onDrop: (e) => dragDrop.handleDrop(e, index),
              onDragEnd: dragDrop.handleDragEnd,
              onDragLeave: dragDrop.handleDragLeave,
            }}
            isDragging={dragDrop.isDragging(index)}
            isDropTarget={dragDrop.isDropTarget(index)}
          />
        ))}
      </div>
    </div>
  );
};