import {Type, Shapes, Image, Layers, Shredder, Wallpaper } from "lucide-react"
import styles from './ToolBar.module.css'
export const ToolBar = ( 
    {onToolClick, selectedElementIds} :
    {
      onToolClick: (toolName: string) => void;
      selectedElementIds?: string[];
    }
) => {
    return (
        <div className={styles['bottom-bar']}>
          <button 
            className={styles['icon-button']}
            onClick={
              () => onToolClick("text")
          }>
            <Type className={styles['tool-icon']}/>
          </button>
          <button 
            className={styles['icon-button']}
            onClick={
              () => onToolClick("shape")
          }>
            <Shapes className={styles['tool-icon']}/>
          </button>
          <button 
            className={styles['icon-button']}
            onClick={
              () => onToolClick("image")
          }>
            <Image className={styles['tool-icon']}/>
          </button>
          <button 
            className={styles['icon-button']}
            onClick={
              () => onToolClick("layers")
          }>
            <Layers className={styles['tool-icon']}/>
          </button>
          <button 
            className={styles['icon-button']}
            onClick={
              () => onToolClick("trash")
          }>
            <Shredder className={styles['tool-icon']}/>
          </button>

          <div className={styles['bottom-bar-divider']}></div>

          <button 
            className={styles['icon-button']}
            onClick={
              () => onToolClick("background")
          }>  
            <Wallpaper className={styles['tool-icon']}/>
          </button>
        </div>
    )
}