import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Presentation, Slide, Position, Size, Background, TextElement, ImageElement } from '../types';
import { initialPresentation } from '../data';

const initialState: Presentation = initialPresentation;

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    updateTitle: (state, action: PayloadAction<{ title: string }>) => {
      state.title = action.payload.title;
    },

    selectElement: (
      state,
      action: PayloadAction<{ elementId: string; addToSelection?: boolean }>
    ) => {
      const { elementId, addToSelection } = action.payload;
      
      if (addToSelection) {
        if (state.selection.elementIds.includes(elementId)) {
          state.selection.elementIds = state.selection.elementIds.filter(
            id => id !== elementId
          );
        } else {
          state.selection.elementIds.push(elementId);
        }
      } else {
        state.selection.elementIds = [elementId];
      }
    },

    selectMultipleElements: (
      state,
      action: PayloadAction<{ elementIds: string[] }>
    ) => {
      state.selection.elementIds = action.payload.elementIds;
    },

    deselectAll: (state) => {
      state.selection.slideIds = [];
      state.selection.elementIds = [];
    },

    addSlide: (state) => {
      const newSlide: Slide = {
        id: `slide-${Date.now()}`,
        size: { width: 1280, height: 720 },
        background: { type: 'color', value: '#ffffff' },
        elements: []
      };

      state.slides.push(newSlide);
      state.selection.slideIds = [newSlide.id];
    },

    deleteSlide: (state, action: PayloadAction<{ slideId: string }>) => {
      if (state.slides.length <= 1) {
        return;
      }

      state.slides = state.slides.filter(
        slide => slide.id !== action.payload.slideId
      );
      state.selection.slideIds = state.selection.slideIds.filter(
        id => id !== action.payload.slideId
      );
    },

    selectSlide: (
      state,
      action: PayloadAction<{ slideId: string; addToSelection?: boolean }>
    ) => {
      const { slideId, addToSelection } = action.payload;

      if (addToSelection) {
        if (state.selection.slideIds.includes(slideId)) {
          state.selection.slideIds = state.selection.slideIds.filter(
            id => id !== slideId
          );
        } else {
          state.selection.slideIds.push(slideId);
        }
      } else {
        state.selection.slideIds = [slideId];
      }
      
      state.selection.elementIds = [];
    },

    reorderSlides: (
      state,
      action: PayloadAction<{ fromIndices: number[]; toIndex: number }>
    ) => {
      const { fromIndices, toIndex } = action.payload;
      const sortedIndices = [...fromIndices].sort((a, b) => a - b);

      const newSlides = [...state.slides];
      const movedSlides = sortedIndices.map(index => newSlides[index]);

      for (let i = sortedIndices.length - 1; i >= 0; i--) {
        newSlides.splice(sortedIndices[i], 1);
      }

      let adjustedToIndex = toIndex;
      for (const fromIndex of sortedIndices) {
        if (fromIndex < toIndex) {
          adjustedToIndex--;
        }
      }

      if (toIndex !== 0) adjustedToIndex += 1;
      newSlides.splice(adjustedToIndex, 0, ...movedSlides);

      state.slides = newSlides;
      state.selection.slideIds = movedSlides.map(s => s.id);
    },

    updateElementPosition: (
      state,
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
    },

    updateGroupPositions: (
      state,
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
    },

    updateElementSize: (
      state,
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
    },

    addTextElement: (state, action: PayloadAction<{ slideId: string }>) => {
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
    },

    addImageElement: (state, action: PayloadAction<{ slideId: string }>) => {
      const { slideId } = action.payload;
      const slide = state.slides.find(s => s.id === slideId);

      if (slide) {
        const Images: string[] = [
          'https://i.pinimg.com/736x/62/64/57/626457731d0ab3dc14118c6c4f348661.jpg',
          'https://i.pinimg.com/1200x/1f/c7/cd/1fc7cdb1d3fc240477dc9c215fa6dc09.jpg',
          'https://i.pinimg.com/736x/c5/fc/4a/c5fc4ad0137578f3ba6673e9426560cb.jpg',
          'https://i.pinimg.com/736x/46/8f/5c/468f5c5140266bf9898b5d363ec5032d.jpg',
          'https://i.pinimg.com/736x/ca/32/79/ca32795567326c5385d89dce5fb47f2f.jpg',
          'https://i.pinimg.com/736x/29/7e/8c/297e8c19a0057ac9f2a5a479551e4b19.jpg'
        ];

        const newImageElement: ImageElement = {
          id: `image-${Date.now()}`,
          type: 'image',
          src: Images[Math.floor(Math.random() * Images.length)],
          position: { x: 150, y: 150 },
          size: { width: 500, height: 500 }
        };

        slide.elements.push(newImageElement);
        state.selection.elementIds = [newImageElement.id];
      }
    },

    deleteSelectedElements: (
      state,
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
    },

    cycleBackground: (state, action: PayloadAction<{ slideId: string }>) => {
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
  }
});

export const {
  updateTitle,
  selectElement,
  selectMultipleElements,
  deselectAll,
  addSlide,
  deleteSlide,
  selectSlide,
  reorderSlides,
  updateElementPosition,
  updateGroupPositions,
  updateElementSize,
  addTextElement,
  addImageElement,
  deleteSelectedElements,
  cycleBackground
} = editorSlice.actions;

export default editorSlice.reducer;