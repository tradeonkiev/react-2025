import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './editorSlice/editorSlice';
import historyReducer, { execute, updateHistory } from './history/historySlice';
import authReducer from './auth/authSlice';
import type { Middleware } from '@reduxjs/toolkit';
import { syncWithHistory } from './editorSlice/editorSlice';

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
  const stateBefore = store.getState().editor;

  if (undoableActions.includes(action.type)) {
    store.dispatch(updateHistory(stateBefore));
  }

  const result = next(action);

  if (undoableActions.includes(action.type)) {
    const stateAfter = store.getState().editor;
    store.dispatch(execute({
      event: action.type,
      presentation: stateAfter
    }));
  }

  return result;
};

const syncMiddleware: Middleware = store => next => (action: any) => {
  const result = next(action);
  
  if (action.type === 'history/undo' || action.type === 'history/redo') {
    const historyState = store.getState().history.present;
    store.dispatch(syncWithHistory(historyState));
  }
  
  return result;
};

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    history: historyReducer,
    auth: authReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(historyMiddleware, syncMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;