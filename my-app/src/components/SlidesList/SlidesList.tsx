import clsx from 'clsx';
import React from 'react';
import { Grid, Plus, Trash2 } from "lucide-react";
import type { Slide } from '../../types';
import { Viewport } from '../Canvas/Viewport';
import styles from './SlideList.module.css';

interface SlidesListProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSlideClick: (slideId: string, index: number) => void;
  onAddSlide: () => void;
  onDeleteSlide: (slideId: string, index: number) => void;
}

const SlidePreview = ( 
  { slide, index, isActive, onClick, onAddSlide, onDeleteSlide }: 
  {
    slide: Slide;
    index: number;
    isActive: boolean;
    onClick: () => void;
    onAddSlide: () => void;
    onDeleteSlide: () => void;
  }
) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={
        clsx(
          styles['thumbnail-slide'],
          {[styles['active']] : isActive}
        )}
    >
      <Viewport 
        slide={slide}
        width={264}
        height={148.5}
      />
      
      <div className={styles['label']}>
        {(index + 1).toString().padStart(2, '0')}
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onAddSlide();
        }}
        className={
          clsx(
            styles['add-slide'],
            {[styles['active']] : isHovered}
      )}>
        <Plus className={styles['add-slide-icon']}/>
      </button>
      
      {isHovered && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDeleteSlide();
          }}
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Trash2 size={12} color="red" />
        </button>
      )}
    </div>
  );
};

export const SlidesList = (
  { 
    slides, 
    currentSlideIndex, 
    onSlideClick,
    onAddSlide,
    onDeleteSlide
  } : SlidesListProps
) => {
  return (
    <div className={styles['thumbnail-wrapper']}>
      <div className={styles['page-number']}>
        <div className={styles['icon-side']}>
          <Grid strokeWidth={1} />
        </div>
        <div className={styles['page-number-text']}>
          {currentSlideIndex + 1} / {slides.length}
        </div>
      </div>
      <div className={styles['thumbnail-list']}>
        {slides.map((slide, index) => (
          <SlidePreview
            key={slide.id}
            slide={slide}
            index={index}
            isActive={index === currentSlideIndex}
            onClick={() => onSlideClick(slide.id, index)}
            onAddSlide={onAddSlide}
            onDeleteSlide={() => onDeleteSlide(slide.id, index)}
          />
        ))}
      </div>
    </div>
  );
};