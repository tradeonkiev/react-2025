import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './editorSlice';
import historyReducer, { execute } from './historySlice';
import type { Middleware } from '@reduxjs/toolkit';

const undoableActions = [
  "editor/updateTitle",
  "editor/selectElement",
  "editor/selectMultipleElements",
  "editor/deselectAll",
  "editor/addSlide",
  "editor/deleteSlide",
  "editor/selectSlide",
  "editor/reorderSlides",
  "editor/updateElementPosition",
  "editor/updateGroupPositions",
  "editor/updateElementSize",
  "editor/addTextElement",
  "editor/addImageElement",
  "editor/endUserAction",
  "editor/deleteSelectedElements",
  "editor/cycleBackground"
];

const historyMiddleware: Middleware = store => next => (action: any) => {
  const result = next(action);
  if (undoableActions.includes(action.type)) {
    const state = store.getState().editor;
    store.dispatch(
      execute(state)
    );
  }

  return result;
};

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    history: historyReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(historyMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//TODO: переделать использования стора
//TODO: сделать чтобы выделение не тригирило историю