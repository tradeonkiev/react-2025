import { createSlice } from '@reduxjs/toolkit';
import type { Presentation } from '../../types';
import { initialPresentation } from '../../data';
import * as reducers from './history.reducers';

export interface HistoryState {
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
  reducers
});

export const { initHistory, execute, undo, redo, updateHistory } = historySlice.actions;
export default historySlice.reducer;
