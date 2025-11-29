import React from 'react';
import { Pencil, FileText, Redo2, Undo2, Presentation, Bird } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { updateTitle } from '../../Store/editorSlice';
import { undo, redo } from '../../Store/historySlice';
import styles from './Header.module.css';

export const Header = () => {
  const dispatch = useAppDispatch();
  const title = useAppSelector((state) => state.history.present.title);
  
  const [isHovered, setIsHovered] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const spanRef = React.useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = React.useState(200);

  React.useEffect(() => {
    if (spanRef.current) {
      const width = spanRef.current.offsetWidth + 10;
      setInputWidth(width);
    }
  }, [title, isEditing]);

  return (
    <div className={styles['top-bar']}>
      <div className={styles['top-bar-left']}>
        <button 
          className={styles['icon-button']}
          onClick={() => dispatch(undo())}
        >
          <Undo2 className={styles['redo-undo-icon']}/>
        </button>
        <button 
          className={styles['icon-button']}
          onClick={() => dispatch(redo())}
        >
          <Redo2 className={styles['redo-undo-icon']}/>
        </button>
      </div>

      <div
        className={styles['top-bar-center']}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles['ppt-icon']}>
          <Bird style={{height: '14px'}}/>
        </div>
        <span
          ref={spanRef}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            whiteSpace: 'pre',
            fontSize: '14px',
            fontFamily: 'Segoe UI',
          }}
        >
          {title || ' '}
        </span>

        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => dispatch(updateTitle({ title: e.target.value }))}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className={styles['title-input']}
            style={{
              width: `${inputWidth}px`,
            }}
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className={styles['title-text']}
          >
            <span style={{ whiteSpace: 'nowrap' }}>
              {title}
            </span>
            <Pencil className={styles['title-edit']} style={{opacity: isHovered? 1: 0}}/>
          </div>
        )}
      </div>
      
      <div className={styles['top-bar-right']}>
        <button 
          className={styles['ppt-button']}
          onClick={() => console.log("сохранить")}
        >
          <FileText style={{ width: 18, height: 18 }} />
          Сохранить
        </button>

        <button 
          className={styles['ppt-button']}
          onClick={() => console.log("транслировать")}
        >
          <Presentation style={{ width: 18, height: 18 }} />
          Трансляция
        </button>
      </div>
    </div>
  );
};