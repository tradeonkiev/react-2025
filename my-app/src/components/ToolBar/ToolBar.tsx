import { Type, Shapes, Image, Layers, Shredder, Wallpaper } from "lucide-react";
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import {
  addTextElement,
  addImageElement,
  deleteSelectedElements,
  cycleBackground
} from '../../Store/editorSlice';
import styles from './ToolBar.module.css';

export const ToolBar = () => {
  const dispatch = useAppDispatch();
  const currentSlideId = useAppSelector((state) => state.history.present.selection.slideIds[0]);

  const handleToolClick = (toolName: string) => {
    switch (toolName) {
      case "text":
        dispatch(addTextElement({ slideId: currentSlideId }));
        break;
      case "image":
        dispatch(addImageElement({ slideId: currentSlideId }));
        break;
      case "background":
        dispatch(cycleBackground({ slideId: currentSlideId }));
        break;
      case "trash":
        dispatch(deleteSelectedElements({ slideId: currentSlideId }));
        break;
      case "shape":
      case "layers":
        console.log("Unknown tool:", toolName);
        break;
      default:
        console.log("Unknown tool:", toolName);
    }
  };

  return (
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
        <Image className={styles['tool-icon']}/>
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
  );
};