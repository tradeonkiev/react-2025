import type { PayloadAction } from '@reduxjs/toolkit';
import type { Presentation } from '../../types';
import type { HistoryState } from './historySlice';

export const initHistory = (
  state: HistoryState,
  action: PayloadAction<Presentation>
) => {
  state.present = action.payload;
};

export const updateHistory = (state: HistoryState) => {
  state.past.push(state.present);
  state.future = [];
};

export const execute = (
  state: HistoryState,
  action: PayloadAction<{ event: string; presentation: Presentation }>
) => {
  state.present = action.payload.presentation;
};

export const undo = (state: HistoryState) => {
  if (state.past.length === 0) return;
  const previous = state.past.pop()!;
  state.future.unshift(state.present);
  state.present = previous;
};

export const redo = (state: HistoryState) => {
  if (state.future.length === 0) return;
  const next = state.future.shift()!;
  state.past.push(state.present);
  state.present = next;
};
