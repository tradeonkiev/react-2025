import type { Background, Presentation, Slide,  } from './types';
import React from 'react';

function generateId(): string {
  return Math.random().toString(36);
}

export const getBackgroundStyle = (background: Background): React.CSSProperties => {
  if (background.type === 'color') {
    return { backgroundColor: background.value };
  } else if (background.type === 'image') {
    return { 
      backgroundImage: `url(${background.src})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  }
  return { backgroundColor: '#ffffff' };
};

export function changePresentationTitle(
  presentation: Presentation,
  newTitle: string
): Presentation {
  return {
    ...presentation,
    title: newTitle,
  };
}

export function addSlide(
  presentation: Presentation,
  position?: number
): Presentation {
  const newSlide: Slide = {
    id: generateId(),
    size: {width: 1280, height: 720},
    background: { type: 'none' },
    elements: [],
  };

  const newSlides = [...presentation.slides];

  if (position === undefined) {
    newSlides.push(newSlide);
  } else {
    newSlides.splice(position, 0, newSlide);
  }

  return {
    ...presentation,
    slides: newSlides,
  };
}

export function changeSlideBackground(
  presentation: Presentation,
  params: { slideId: string; background: Background }  
): Presentation {
  const { slideId, background } = params;
  
  const newSlides = presentation.slides.map((slide) => {
    if (slide.id === slideId) {
      return {
        ...slide,
        background: background,
      };
    }
    return slide;
  });

  return {
    ...presentation,
    slides: newSlides,
  };
}