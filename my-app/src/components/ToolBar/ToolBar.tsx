import { useState } from 'react';
import { Type, Shapes, Image as ImageIcone, Layers, Shredder, Wallpaper } from "lucide-react";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addTextElement,
  deleteSelectedElements,
  cycleBackground
} from '../../store/editorSlice/editorSlice';
import { ImageModal } from '../ImageModal/ImageModal';
import styles from './ToolBar.module.css';

export const ToolBar = () => {
  const dispatch = useAppDispatch();
  const currentSlideId = useAppSelector((state) => state.history.present.selection.slideIds[0]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleToolClick = (toolName: string) => {
    switch (toolName) {
      case "text":
        dispatch(addTextElement({ slideId: currentSlideId }));
        break;
      case "image":
        setIsImageModalOpen(true);
        break;
      case "background":
        dispatch(cycleBackground({ slideId: currentSlideId }));
        break;
      case "trash":
        dispatch(deleteSelectedElements({ slideId: currentSlideId }));
        break;
      case "shape":
      case "layers":
        console.log("Feature not implemented:", toolName);
        break;
      default:
        console.log("Unknown tool:", toolName);
    }
  };

  const handleImageSelect = (imageSrc: string) => {
    // TODO: поменять на нормальную (лень было)
    const img = new Image();
    img.onload = () => {
      dispatch({
        type: 'editor/addImageElement',
        payload: {
          slideId: currentSlideId,
          imageSrc,
          width: img.width,
          height: img.height
        }
      });
    }
    img.src = imageSrc
    
  };

  // TODO: поменять структуру (не нравится)
  return (
    <>
      <div className={styles['bottom-bar']}>
        <button 
          className={styles['icon-button']}
          onClick={() => handleToolClick("text")}
        >
          <Type className={styles['tool-icon']}/>
        </button>
        <button 
          className={styles['icon-button']}
          onClick={() => handleToolClick("shape")}
        >
          <Shapes className={styles['tool-icon']}/>
        </button>
        <button 
          className={styles['icon-button']}
          onClick={() => handleToolClick("image")}
        >
          <ImageIcone className={styles['tool-icon']}/>
        </button>
        <button 
          className={styles['icon-button']}
          onClick={() => handleToolClick("layers")}
        >
          <Layers className={styles['tool-icon']}/>
        </button>
        <button 
          className={styles['icon-button']}
          onClick={() => handleToolClick("trash")}
        >
          <Shredder className={styles['tool-icon']}/>
        </button>

        <div className={styles['bottom-bar-divider']}></div>

        <button 
          className={styles['icon-button']}
          onClick={() => handleToolClick("background")}
        >  
          <Wallpaper className={styles['tool-icon']}/>
        </button>
      </div>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onImageSelect={handleImageSelect}
      />
    </>
  );
};