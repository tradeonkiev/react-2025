import type { Presentation, Position, Size, TextElement, ImageElement, Background } from "../../../types";
import type { PayloadAction } from "@reduxjs/toolkit";

export const updateElementPosition = (
  state: Presentation,
  action: PayloadAction<{
    slideId: string;
    elementId: string;
    position: Position;
  }>
) => {
  const { slideId, elementId, position } = action.payload;
  const slide = state.slides.find(s => s.id === slideId);
  
  if (slide) {
    const element = slide.elements.find(e => e.id === elementId);
    if (element) {
      element.position = position;
    }
  }
}

export const updateGroupPositions = (
  state: Presentation,
  action: PayloadAction<{
    slideId: string;
    updates: Array<{ elementId: string; position: Position }>;
  }>
) => {
  const { slideId, updates } = action.payload;
  const slide = state.slides.find(s => s.id === slideId);

  if (slide) {
    updates.forEach(({ elementId, position }) => {
      const element = slide.elements.find(e => e.id === elementId);
      if (element) {
        element.position = position;
      }
    });
  }
}

export const updateElementSize = (
  state: Presentation,
  action: PayloadAction<{
    slideId: string;
    elementId: string;
    size: Size;
    position: Position;
  }>
) => {
  const { slideId, elementId, size, position } = action.payload;
  const slide = state.slides.find(s => s.id === slideId);

  if (slide) {
    const element = slide.elements.find(e => e.id === elementId);
    if (element) {
      element.size = size;
      element.position = position;
    }
  }
}

export const deleteSelectedElements = (
  state: Presentation,
  action: PayloadAction<{ slideId: string }>
) => {
  const { slideId } = action.payload;
  const slide = state.slides.find(s => s.id === slideId);

  if (slide) {
    slide.elements = slide.elements.filter(
      element => !state.selection.elementIds.includes(element.id)
    );
    state.selection.elementIds = [];
  }
}

export const addTextElement = (
  state: Presentation, 
  action: PayloadAction<{ slideId: string }>
) => {
  const { slideId } = action.payload;
  const slide = state.slides.find(s => s.id === slideId);

  if (slide) {
    const newTextElement: TextElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'Новый текст',
      position: { x: 100, y: 100 },
      size: { width: 200, height: 50 },
      color: '#000000',
      fontFamily: 'Arial',
      fontSize: 24
    };

    slide.elements.push(newTextElement);
    state.selection.elementIds = [newTextElement.id];
  }
}


// TODO: избавится от пресетов пусть ошибку выкуидывает (пресеты говно идея) + доделать чтобы картинка со своими размерами добавлялась (прокидывать + изменить в шаблоне)
export const addImageElement = (
  state: Presentation, 
  action: PayloadAction<{ slideId: string; imageSrc: string, width: number, height: number }>
) => {
  const { slideId, imageSrc, width, height } = action.payload;
  const slide = state.slides.find(s => s.id === slideId);

  if (slide) {
    const imageSource = imageSrc;

    const newImageElement: ImageElement = {
      id: `image-${Date.now()}`,
      type: 'image',
      src: imageSource,
      position: { x: 150, y: 150 },
      size: { width, height }
    };

    slide.elements.push(newImageElement);
    state.selection.elementIds = [newImageElement.id];
  }
}

export const cycleBackground = (
  state: Presentation, 
  action: PayloadAction<{ slideId: string }>
) => {
  const { slideId } = action.payload;
  const slide = state.slides.find(s => s.id === slideId);

  if (slide) {
    const backgrounds: Background[] = [
      { type: 'color', value: '#ffffff' },
      { type: 'color', value: '#f3f4f6' },
      { type: 'color', value: '#3b82f6' },
      { type: 'color', value: '#ef4444' },
      { type: 'color', value: '#10b981' },
      { type: 'color', value: '#f59e0b' },
      {
        type: 'image',
        src: 'https://i.pinimg.com/736x/76/88/51/768851d3863fc7d8403d43e572ceb350.jpg'
      },
      {
        type: 'image',
        src: 'https://i.pinimg.com/736x/c9/55/6c/c9556c51f8732bdeac67eafebdaeb6d3.jpg'
      },
      { type: 'none' }
    ];

    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    slide.background = backgrounds[randomIndex];
  }
}