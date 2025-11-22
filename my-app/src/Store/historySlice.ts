import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Presentation } from '../types';
import { initialPresentation } from '../data';

interface HistoryState {
  past: Presentation[];
  present: Presentation;
  future: Presentation[];
}

const initialState: HistoryState = {
  past: [],
  present: initialPresentation,
  future: []
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    initHistory(state, action: PayloadAction<Presentation>) {
      state.present = action.payload;
    },

    execute(state, action: PayloadAction<Presentation>) {
      state.past.push(state.present);
      state.present = action.payload;
      state.future = [];
    },

    undo(state) {
      if (state.past.length === 0) return;

      const previous = state.past.pop()!;
      state.future.unshift(state.present);
      state.present = previous;
    },

    redo(state) {
      if (state.future.length === 0) return;

      const next = state.future.shift()!;
      state.past.push(state.present);
      state.present = next;
    }
  }
});

export const { initHistory, execute, undo, redo } = historySlice.actions;
export default historySlice.reducer;
