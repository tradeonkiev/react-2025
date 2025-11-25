import type { PayloadAction } from "@reduxjs/toolkit";
import type { Presentation, Slide } from "../../types";


export const addSlide = (state: Presentation) => {
  const newSlide: Slide = {
    id: `slide-${Date.now()}`,
    size: { width: 1280, height: 720 },
    background: { type: 'color', value: '#ffffff' },
    elements: []
  };

  state.slides.push(newSlide);
  // state.selection.slideIds = [newSlide.id]   
}

export const deleteSlide = (
  state: Presentation,
  action: PayloadAction<{ slideId: string}>
) => {
  if (state.slides.length <= 1) return;

  state.slides = state.slides.filter(
    slide => slide.id !== action.payload.slideId
  );
  state.selection.slideIds = state.selection.slideIds.filter(
    id => id !== action.payload.slideId
  );
}

export const reorderSlides = (
  state: Presentation,
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
}
