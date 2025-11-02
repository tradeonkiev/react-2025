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
      <div className={styles['protective-film']}></div>
      <Viewport 
        slide={slide}
        width={264}
        height={148.5}
      />
      
      <div className={styles['label']}>
        {(index + 1).toString().padStart(2, '0')}
      </div>
      
      <button 
        onClick={() => onAddSlide()}
        className={
          clsx(
            styles['add-slide'],
            {[styles['active']] : isHovered}
      )}>
        <Plus className={styles['add-slide-icon']}/>
      </button>

      <button 
        onClick={() => onDeleteSlide()}
        className={
          clsx(
            styles['delete-slide'],
            {[styles['active']] : isActive || isHovered}
          )}
      >
        <Trash2 className={styles['delete-slide-icon']}/>
      </button>
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