import type { TextElement, ImageElement, Slide, Presentation } from './types';

export const textElement1: TextElement = {
  id: 'text1',
  type: 'text',
  position: { x: 100, y: 50 },
  size: { width: 300, height: 40 },
  content: 'Заголовок слайда',
  fontFamily: 'Arial',
  fontSize: 24,
  color: '#bc1919ff',
};

export const textElement2: TextElement = {
  id: 'text2',
  type: 'text',
  position: { x: 100, y: 120 },
  size: { width: 400, height: 60 },
  content: 'Подзаголовок',
  fontFamily: 'Times New Roman',
  fontSize: 18,
  color: '#666666',
};

export const imageElement1: ImageElement = {
  id: 'img1',
  type: 'image',
  position: { x: 200, y: 200 },
  size: { width: 250, height: 180 },
  src: 'https://i.pinimg.com/736x/28/16/1e/28161ebfe0e8fa91b5d4e5155980019c.jpg',
};

export const imageElement3: ImageElement = {
  id: 'img3',
  type: 'image',
  position: { x: 900, y: 200 },
  size: { width: 500, height: 500 },
  src: 'https://i.pinimg.com/736x/12/7a/ee/127aeef722c56170598268788851a02e.jpg',
}

export const imageElement2: ImageElement = {
  id: 'img2',
  type: 'image',
  position: { x: 50, y: 400 },
  size: { width: 150, height: 100 },
  src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
};

export const slide1: Slide = {
  id: 'slide1',
  size: {width: 1280, height: 720},
  background: { type: 'color', value: '#332e2eff' },
  elements: [textElement1, imageElement1, imageElement3],
};

export const slide2: Slide = {
  id: 'slide2',
  size: {width: 1280, height: 720},
  background: { type: 'image', src: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800' },
  elements: [textElement2, imageElement2],
};

export const slide3: Slide = {
  id: 'slide3',
  size: {width: 1280, height: 720},
  background: { type: 'none' },
  elements: [],
};

export const initialPresentation: Presentation = {
  id: 'pres2',
  title: 'Максимальная презентация',
  slides: [slide1, slide2, slide3],
  selection: {
    slideIds: ['slide1'],
    elementIds: [],
  },
};