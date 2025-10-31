import type { Slide, SlideElement } from '../../types';
import { Viewport } from '../Canvas/Viewport';
import styles from './Editor.module.css'

interface EditorProps {
  slide: Slide;
  onElementClick: (elementId: string, element: SlideElement) => void;
  width: number;
  height: number;
  selectedElementIds?: string[];
}

export const Editor = (
  { slide, onElementClick, width, height, selectedElementIds }: EditorProps
) => {
  return (
    <div className={styles['editor-container']}>
      <div className={styles['wrapper']}>
        <Viewport 
          slide={slide} 
          width={width} 
          height={height} 
          selectedElementIds={selectedElementIds}
          onElementClick={onElementClick}
        />
      </div>
    </div>
  );
};