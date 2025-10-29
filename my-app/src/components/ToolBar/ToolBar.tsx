import {Type, Shapes, Image, Layers, Shredder, Wallpaper } from "lucide-react"
import styles from './ToolBar.module.css'
export const ToolBar = ( 
    {onToolClick} : {onToolClick: (toolName: string) => void;}
) => {
    return (
        <div className={styles['bottom-bar']}>
          <button 
          className={styles['icon-button']}
          onClick={
            () => onToolClick("текста")
          }>
            <Type className={styles['tool-icon']}/>
          </button>
          <button 
          className={styles['icon-button']}
          onClick={
            () => onToolClick("обьекты")
          }>
            <Shapes className={styles['tool-icon']}/>
          </button>
          <button 
          className={styles['icon-button']}
          onClick={
            () => onToolClick("картинки")
          }>
            <Image className={styles['tool-icon']}/>
          </button>
          <button 
          className={styles['icon-button']}
          onClick={
            () => onToolClick("слои")
          }>
            <Layers className={styles['tool-icon']}/>
          </button>
          <button 
          className={styles['icon-button']}
          onClick={
            () => onToolClick("мусорка")
          }>
            <Shredder className={styles['tool-icon']}/>
          </button>

          <div className={styles['bottom-bar-divider']}></div>

          <button 
          className={styles['icon-button']}
          onClick={
            () => onToolClick("фон")
          }>  
            <Wallpaper className={styles['tool-icon']}/>
          </button>
        </div>
    )
}