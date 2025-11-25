import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Presentation } from '../types';
import { initialPresentation } from '../data';

import * as slides from './reducer/slides';
import * as selection from './reducer/selection'
import * as elements from './reducer/elements'

const initialState: Presentation = initialPresentation;

const editorSlice = createSlice({

  name: 'editor',
  initialState,
  reducers: {
    updateTitle: (state, action: PayloadAction<{ title: string }>) => {
      state.title = action.payload.title;
    },

    ...slides, 
    ...selection,
    ...elements,

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
