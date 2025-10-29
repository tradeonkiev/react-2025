import clsx from 'clsx';
import React from 'react';
import { Grid, Plus } from "lucide-react";
import type { Slide } from '../../types';
import { getBackgroundStyle } from '../../utils';
import {Editor} from '../Editor/Editor'
import styles from './SlideList.module.css';
import { Viewport } from '../Canvas/Viewport';

interface SlidesListProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSlideClick: (slideId: string, index: number) => void;
}

const SlidePreview = ( 
  { slide, index, isActive, onClick }: 
  {
    slide: Slide;
    index: number;
    isActive: boolean;
    onClick: () => void;
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
      {/* <Canvas
        slide={slide}
        onElementClick={() => console.log('penis')}
        onToolClick={() => console.log('penis')}
        width={264}
        height={148.5}
      /> */}

      <Viewport 
        slide={slide}
        width={264}
        height={148.5}
      />
      {/* <div
        style={{
          aspectRatio: '16/9',
          position: 'relative',
          ...getBackgroundStyle(slide.background)
        }}
      >
        {slide.elements.map((element) => (
          <div
            key={element.id}
            style={{
              position: 'absolute',
              left: `${(element.position.x / 1280) * 100}%`,
              top: `${(element.position.y / 720) * 100}%`,
              width: `${(element.size.width / 1280) * 100}%`,
              height: `${(element.size.height / 720) * 100}%`,
            }}
          >
            {element.type === 'text' ? (
              <div
                style={{
                  color: element.color,
                  fontFamily: element.fontFamily,
                  fontSize: `${element.fontSize / 720 * 100}px`,
                }}
              >
                {element.content}
              </div>
            ) : (
              <img
                src={element.src}
                alt=""
                className={styles['thumbnail-img']}
              />
            )}
          </div>
        ))}
      </div> */}
      <div className={styles['label']}>
        {(index + 1).toString().padStart(2, '0')}
      </div>
      <div 
        className={
          clsx(
            styles['add-slide'],
            {[styles['active']] : isHovered}
      )}>
        <Plus 
          className={styles['add-slide-icon']}
        />
      </div> 
    </div>
  );
};

export const SlidesList = (
  { 
    slides, 
    currentSlideIndex, 
    onSlideClick 
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
          />
        ))}
      </div>
    </div>
  );
};