import type { Background } from './types';
import React from 'react';

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