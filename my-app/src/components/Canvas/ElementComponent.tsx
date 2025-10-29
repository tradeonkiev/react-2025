import React from "react";
import type { SlideElement } from '../../types';

export const ElementComponent = (
  { element, onClick, canvasScale }: 
  {
    element: SlideElement;
    onClick: () => void;
    canvasScale: number;
  }
) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: element.position.x * canvasScale,
        top: element.position.y * canvasScale,
        width: element.size.width * canvasScale,
        height: element.size.height * canvasScale,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        boxShadow: isHovered ? '0 0 0 2px #60a5fa' : 'none'
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
          }}
        >
          {element.content}
        </div>
      ) : (
        <img
          src={element.src}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  );
};