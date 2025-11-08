import React from "react";
import type { SlideElement } from '../../types';

export const ElementComponent = (
  { 
    element, 
    onClick, 
    canvasScale, 
    isSelected,  
    onDragStart,
    onDrag,
    onDragEnd,
    isDragging
  }: 
  {
    element: SlideElement;
    onClick: () => void;
    canvasScale: number;
    isSelected: boolean;
    onDragStart: (e: React.MouseEvent, elementId: string) => void;
    onDrag: (e: React.MouseEvent) => void;
    onDragEnd: () => void;
    isDragging: boolean;
  }
) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
    onDragStart(e, element.id)
  }
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: element.position.x * canvasScale,
        top: element.position.y * canvasScale,
        width: element.size.width * canvasScale,
        height: element.size.height * canvasScale,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'box-shadow 0.2s',
        boxShadow: isSelected 
          ? '0 0 0 2px #60a5fa' 
          : isHovered 
          ? '0 0 0 2px #93c5fd' 
          : 'none',
        zIndex: isDragging ? 1000 : 1
      }}
    >
      {element.type === 'text' ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            color: element.color,
            fontFamily: element.fontFamily,
            fontSize: element.fontSize * canvasScale,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',  
            userSelect: 'none'     
          }}
        >
          {element.content}
        </div>
      ) : (
        <img
          src={element.src}
          alt=""
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            pointerEvents: 'none',  // ✅ Добавили
            userSelect: 'none'       // ✅ Добавили
          }}
          draggable={false}
        />
      )}
    </div>
  );
};