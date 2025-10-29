import React from 'react';
import type { Slide, SlideElement } from '../../types';
import { Viewport } from '../Canvas/Viewport';
import styles from './Editor.module.css'


interface CanvasProps {
  slide: Slide;
  onElementClick: (elementId: string, element: SlideElement) => void;
  onToolClick: (toolName: string) => void;
  width: number;
  height: number;
}

export const Editor = (
  { slide, onElementClick, width, height }: CanvasProps
) => {
  return (
    <div className={styles['editor-container']}>
      <div className={styles['wrapper']
        // {
        // display: 'flex',
        // flex: 1,
        // alignItems: 'center', 
        // justifyContent: 'center',
        // padding: '32px',
        // }
        }>
        <Viewport slide={slide} width={width} height={height}/>
      </div>
    </div>
  );
};
